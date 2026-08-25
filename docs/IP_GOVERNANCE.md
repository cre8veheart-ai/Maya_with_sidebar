# MAYA IP Governance Baseline

## Purpose

MAYA should be built with intellectual-property hygiene from the start so brand, code, documentation, designs, methods, and confidential know-how are not treated as one undifferentiated asset class.

## Trademark discipline

- Use `TM`/`™` only as a claim of trademark rights in a brand, product, feature, or service name.
- Do not use `®` unless the specific mark is actually registered in the relevant jurisdiction.
- Keep a simple mark inventory with owner, exact spelling, first-use context, product/service association, and registration status.
- Favor consistent naming across UI, docs, marketing, and repository text so evidence of use does not fragment.
- Before adopting a major new product or feature name, perform a clearance review rather than assuming availability.

## Copyright discipline

- Treat original source code, documentation, UI copy, diagrams, artwork, test fixtures, and other original expression as copyrightable material where applicable.
- Copyright protects the original expression, not the underlying idea, method, workflow, system, or functional concept by itself.
- Keep authorship and ownership provenance clear for employee, contractor, founder, generated, licensed, and third-party contributions.
- Do not copy third-party text, code, images, or datasets into MAYA without confirming the license or permission basis.
- Preserve third-party notices where required.

## Trade-secret discipline

Some MAYA value may be better protected through confidentiality than publication or registration.

Examples may include:
- proprietary evaluation methods
- internal scoring logic
- unpublished governance heuristics
- customer-specific operating patterns
- private prompts, playbooks, and tuning data
- security procedures and non-public architecture details

Trade-secret candidates should be shared only with people or systems that need them, under appropriate access controls and confidentiality terms.

## Repository practice

- Public-facing naming and brand claims should be deliberate and consistent.
- Sensitive know-how should not be placed in public repositories or broad-access documentation by default.
- Generated files should not erase attribution, license notices, or ownership metadata.
- New dependencies should be reviewed for license compatibility before they become foundational.
- IP-related changes should follow the same workbench rule: bounded change, review, evidence, then promotion.

## MAYA product rule

The platform must distinguish:

1. **Brand assets** — potentially trademark-protected.
2. **Original expression** — potentially copyright-protected.
3. **Functional inventions or methods** — may require separate patent analysis if strategically important.
4. **Confidential know-how** — potentially trade-secret protected if secrecy is maintained.
5. **Third-party material** — governed by its own license or permission terms.

No AI executive may represent an IP right as registered, granted, owned, or cleared without evidence.

## Verification rule

Legal or IP status is an evidence question. A name appearing in the product, a notice appearing in a file, or an executive stating that rights exist is not proof of registration, ownership, clearance, or enforceability.
