package com.kredent.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;

import java.util.Optional;

/**
 * Read-only blockchain access. This class NEVER holds a private key and NEVER submits a
 * transaction — the admin's MetaMask has already signed and submitted the transaction directly
 * from the browser (see frontend/src/services/blockchainService.js) by the time anything here
 * runs. All this does is read the transaction receipt back from the RPC endpoint and confirm:
 *
 *   1. the transaction actually succeeded on-chain (status == success), and
 *   2. it was sent TO our exact smart contract address, and
 *   3. it was sent FROM the configured authorized admin wallet.
 *
 * This stops a compromised or buggy frontend from simply POSTing a made-up transaction hash
 * (or a real hash for some *other* unrelated transaction) and having the backend blindly mark a
 * certificate as blockchain-issued.
 *
 * Known simplification (documented on purpose): this does not decode the contract's event logs
 * to independently re-derive the token ID — it trusts the token ID the frontend reports, once
 * the three checks above pass. Since only the authorized admin wallet can ever get a successful
 * receipt from this contract in the first place, a full event-log decode would add more
 * complexity than value for a project at this stage; it's a natural next hardening step.
 */
@Service
public class BlockchainVerificationService {

    private static final Logger log = LoggerFactory.getLogger(BlockchainVerificationService.class);

    private static final String SUCCESS_STATUS_HEX = "0x1";
    private static final String SUCCESS_STATUS_PLAIN = "1";

    private final Web3j web3j;
    private final String contractAddress;
    private final String adminWalletAddress;
    private final boolean configured;

    public BlockchainVerificationService(
            @Value("${blockchain.rpc-url:}") String rpcUrl,
            @Value("${blockchain.contract-address:}") String contractAddress,
            @Value("${blockchain.admin-wallet-address:}") String adminWalletAddress) {
        this.contractAddress = contractAddress == null ? "" : contractAddress.toLowerCase();
        this.adminWalletAddress = adminWalletAddress == null ? "" : adminWalletAddress.toLowerCase();
        this.configured = rpcUrl != null && !rpcUrl.isBlank() && !this.contractAddress.isBlank();
        this.web3j = this.configured ? Web3j.build(new HttpService(rpcUrl)) : null;

        // Diagnostic-only, logged once at startup — never logs the RPC URL itself (it may embed
        // a provider API key), just whether it's present. This turns a misconfiguration that
        // would otherwise only surface later as an opaque 503 on the first mint attempt into
        // something visible immediately in the console at boot.
        if (configured) {
            log.info("Blockchain verification configured: contract={}, adminWallet={}, rpcUrlSet=true",
                    this.contractAddress, this.adminWalletAddress.isBlank() ? "(not set)" : this.adminWalletAddress);
        } else {
            log.warn("Blockchain verification NOT configured (rpcUrlSet={}, contractAddressSet={}). "
                            + "Every /blockchain/issue and /blockchain/revoke request will fail with 503 until "
                            + "BLOCKCHAIN_RPC_URL is set as a real environment variable and the backend is restarted.",
                    rpcUrl != null && !rpcUrl.isBlank(), !this.contractAddress.isBlank());
        }
    }

    /** Confirms a transaction hash really is a successful call into our contract, from the authorized admin wallet. */
    public void verifyContractTransaction(String transactionHash) {
        if (!configured) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Blockchain is not configured on the server (BLOCKCHAIN_RPC_URL / SMART_CONTRACT_ADDRESS missing)");
        }
        if (transactionHash == null || transactionHash.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing transaction hash");
        }

        TransactionReceipt receipt = fetchReceipt(transactionHash);

        String status = receipt.getStatus();
        boolean succeeded = SUCCESS_STATUS_HEX.equalsIgnoreCase(status) || SUCCESS_STATUS_PLAIN.equals(status);
        if (!succeeded) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "That transaction did not succeed on-chain (status: " + status + ")");
        }

        String to = receipt.getTo() == null ? "" : receipt.getTo().toLowerCase();
        if (!to.equals(contractAddress)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "That transaction was not sent to the SkillChain smart contract");
        }

        if (!adminWalletAddress.isBlank()) {
            String from = receipt.getFrom() == null ? "" : receipt.getFrom().toLowerCase();
            if (!from.equals(adminWalletAddress)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "That transaction was not sent from the authorized admin wallet");
            }
        }
    }

    private TransactionReceipt fetchReceipt(String transactionHash) {
        try {
            Optional<TransactionReceipt> receipt = web3j.ethGetTransactionReceipt(transactionHash)
                    .send()
                    .getTransactionReceipt();
            return receipt.orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "No transaction receipt found yet for that hash — it may still be pending. Please wait a moment and try again."));
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Could not reach the blockchain RPC to verify the transaction: " + e.getMessage());
        }
    }
}
