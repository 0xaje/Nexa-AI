# First-Class Evidence Packages Architecture
### Establishing On-Chain Verifiability via Off-Chain Cryptographic Evidence

---

## 1. Executive Summary

In Nexa AI, decisions are never made in isolation. Every conclusion, market approval, or settlement recommendation must be backed by a verifiable, immutable **Evidence Package**. 

By packaging ingestion signals, model versions, agent reasoning trails, and consensus calculations, and subsequently anchoring their cryptographic hashes on L2 ledgers, the protocol achieves decentralized, auditable verifiability.

---

## 2. Core Package Anatomy

Each Evidence Package contains the following parameters:

```
┌────────────────────────────────────────────────────────┐
│                   Evidence Package                     │
├────────────────────────────────────────────────────────┤
│ 1. signalSources      (Source arrays evaluated)        │
│ 2. metadata           (Protocol names and builds)      │
│ 3. aiInputs           (Source data prompt states)      │
│ 4. agentOutputs       (Sub-agent vote & reasoning list)│
│ 5. reasoning          (Consensus justification)        │
│ 6. confidence         (Confidence rating)              │
│ 7. consensus          (Weight, score & probability)    │
│ 8. cid                (IPFS content address)           │
│ 9. timestamp          (UTC creation mark)              │
│ 10. modelVersion      (LLM models deployed)            │
│ 11. sha256Hash        (Alphabetic serialized hash)     │
└────────────────────────────────────────────────────────┘
```

---

## 3. Database Serialization Mapping

To support the extended Evidence Package structure without breaking existing database schemas or requiring intrusive migrations, parameters are serialized into existing columns in the `EvidencePackage` table:

```
Database Column        ◄───►   Payload JSON Field Mapping
─────────────────────────────────────────────────────────────
normalizedSignal       ◄───►   normalizedSignal
sourceMetadata         ◄───►   { signalSources, metadata, provider, cid, sha256Hash }
aiReasoningRef         ◄───►   { reasoning, aiInputs, agentOutputs, consensus, modelVersion }
confidenceInputs       ◄───►   confidence
```

This mapping is managed cleanly by [EvidenceRepository](file:///home/oyeolorun/AiraMarKet/server/services/evidence/repository.ts).

---

## 4. Deterministic Serialization & Hash Derivation

To guarantee that the exact same evidence inputs yield identical SHA-256 signatures (preventing duplicate processing or validation gaps), the [EvidenceSerializer](file:///home/oyeolorun/AiraMarKet/server/services/evidence/serializer.ts) implements deterministic serialization:

1. **Alphabetical Key Sorting**: Keys at all nested levels of the object are sorted alphabetically.
2. **Deterministic Stringification**: The sorted object is stringified to a strict JSON string.
3. **SHA-256 Hashing**: A cryptographic signature is computed over the string.

```
Object Input ──► Sort Keys Alphabetically ──► JSON Stringify ──► SHA-256 Hash
```

---

## 5. Component Layout

- **[service.ts](file:///home/oyeolorun/AiraMarKet/server/services/evidence/service.ts)**: Serves as the primary coordinator compiling the payload, setting defaults, and uploading to IPFS.
- **[serializer.ts](file:///home/oyeolorun/AiraMarKet/server/services/evidence/serializer.ts)**: Handles key sorting and hashing.
- **[validator.ts](file:///home/oyeolorun/AiraMarKet/server/services/evidence/validator.ts)**: Asserts structural properties and data types.
- **[repository.ts](file:///home/oyeolorun/AiraMarKet/server/services/evidence/repository.ts)**: Handles database persistence and retrieval.
