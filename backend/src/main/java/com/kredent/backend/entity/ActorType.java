package com.kredent.backend.entity;

/** Who performed an audited action. PUBLIC covers anonymous certificate verification. */
public enum ActorType {
    ADMIN,
    STUDENT,
    PUBLIC,
    SYSTEM
}
