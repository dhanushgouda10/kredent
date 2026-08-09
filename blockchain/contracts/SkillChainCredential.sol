// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * SkillChainCredential
 * ---------------------
 * A deliberately simple, non-ERC721 "soulbound" credential registry for the
 * SkillChain final-year project. It is not a full NFT standard on purpose —
 * a college's SBT does not need to be tradable, listed on marketplaces, or
 * approved/transferred by anyone, so none of that machinery exists here.
 * There is no transferFrom, no approve, no ownerOf-with-transfer-rights —
 * a credential, once issued, can only ever be revoked, never moved.
 *
 * Roles:
 *  - issuer: the college admin's wallet (the address that deployed this
 *    contract, or whoever it's later transferred to via setIssuer). This is
 *    the ONLY address allowed to issue or revoke credentials. In SkillChain,
 *    this address is controlled by the admin's MetaMask — the admin signs
 *    every issue/revoke transaction themselves, from the browser.
 *  - studentWallet: a system-managed wallet address (generated and stored
 *    server-side by the SkillChain backend). This address never signs
 *    anything on-chain — it only ever appears as the RECIPIENT of a
 *    credential. Students do not need MetaMask and never touch this
 *    contract directly.
 */
contract SkillChainCredential {
    address public issuer;

    struct Credential {
        string certificateId;     // the SkillChain Postgres certificate UUID (as a string)
        string certificateHash;   // SHA-256 hex hash of the certificate PDF (from Phase 2)
        address studentWallet;    // the student's system-managed wallet address
        uint256 issuedAt;         // block timestamp of issuance
        bool revoked;
        string revokeReason;
    }

    uint256 private nextTokenId = 1;

    // tokenId -> credential record
    mapping(uint256 => Credential) private credentials;

    // certificateId -> tokenId, so the same certificate can never be minted twice
    mapping(string => uint256) public certificateIdToTokenId;

    event CredentialIssued(
        uint256 indexed tokenId,
        string certificateId,
        address indexed studentWallet,
        string certificateHash
    );

    event CredentialRevoked(uint256 indexed tokenId, string reason);

    event IssuerChanged(address indexed previousIssuer, address indexed newIssuer);

    modifier onlyIssuer() {
        require(msg.sender == issuer, "SkillChain: caller is not the authorized issuer");
        _;
    }

    constructor() {
        issuer = msg.sender;
    }

    /**
     * Issues a new credential to a student's system-managed wallet.
     * Only the authorized issuer (college admin, via MetaMask) can call this.
     * The student wallet never has to sign anything — it's just an address.
     */
    function issueCredential(
        string calldata certificateId,
        string calldata certificateHash,
        address studentWallet
    ) external onlyIssuer returns (uint256) {
        require(studentWallet != address(0), "SkillChain: invalid student wallet");
        require(bytes(certificateId).length > 0, "SkillChain: certificateId required");
        require(bytes(certificateHash).length > 0, "SkillChain: certificateHash required");
        require(certificateIdToTokenId[certificateId] == 0, "SkillChain: certificate already minted");

        uint256 tokenId = nextTokenId;
        nextTokenId = nextTokenId + 1;

        credentials[tokenId] = Credential({
            certificateId: certificateId,
            certificateHash: certificateHash,
            studentWallet: studentWallet,
            issuedAt: block.timestamp,
            revoked: false,
            revokeReason: ""
        });
        certificateIdToTokenId[certificateId] = tokenId;

        emit CredentialIssued(tokenId, certificateId, studentWallet, certificateHash);
        return tokenId;
    }

    /**
     * Marks a credential as revoked. The record is kept on-chain forever
     * (nothing is ever deleted) — only its `revoked` flag flips, so the
     * credential's full history stays traceable.
     */
    function revokeCredential(uint256 tokenId, string calldata reason) external onlyIssuer {
        require(credentials[tokenId].studentWallet != address(0), "SkillChain: credential does not exist");
        require(!credentials[tokenId].revoked, "SkillChain: credential already revoked");

        credentials[tokenId].revoked = true;
        credentials[tokenId].revokeReason = reason;

        emit CredentialRevoked(tokenId, reason);
    }

    /** Lets the current issuer hand off control to a new admin wallet (e.g. key rotation). */
    function setIssuer(address newIssuer) external onlyIssuer {
        require(newIssuer != address(0), "SkillChain: invalid new issuer");
        address previous = issuer;
        issuer = newIssuer;
        emit IssuerChanged(previous, newIssuer);
    }

    /** Full credential lookup — used by the verification flow. */
    function getCredential(uint256 tokenId)
        external
        view
        returns (
            string memory certificateId,
            string memory certificateHash,
            address studentWallet,
            uint256 issuedAt,
            bool revoked,
            string memory revokeReason
        )
    {
        Credential memory c = credentials[tokenId];
        require(c.studentWallet != address(0), "SkillChain: credential does not exist");
        return (c.certificateId, c.certificateHash, c.studentWallet, c.issuedAt, c.revoked, c.revokeReason);
    }

    /** Quick VERIFIED/REVOKED-style check: true only if the credential exists and is not revoked. */
    function isValid(uint256 tokenId) external view returns (bool) {
        Credential memory c = credentials[tokenId];
        return c.studentWallet != address(0) && !c.revoked;
    }

    /** Total number of credentials ever issued (revoked or not). */
    function totalIssued() external view returns (uint256) {
        return nextTokenId - 1;
    }

    // NOTE ON "SOULBOUND": there is intentionally no transferFrom, safeTransferFrom,
    // approve, or setApprovalForAll function anywhere in this contract. A credential
    // can never move between wallets, by construction — not by the student, not by
    // the issuer, not by anyone. The only state change possible after issuance is
    // revocation.
}
