---
id: ui-3s9n
title: "At dalek's screen: trust the 'bridle local signing' cert for code signing (br-ptu8, experiment 2)"
kind: chore
created: 2026-11-21
created_by: external:aide
repos: [bridle-ui]
changes: []
specs: []
blocked_by: []
related: []
---

## The ask

Needs you at dalek's own screen (not SSH): macOS asks for confirmation in a dialog.

Either: Keychain Access > login > Certificates > 'bridle local signing' > Trust > Code Signing: Always Trust (enter your password).
Or in Terminal on dalek's desktop: sudo security add-trusted-cert -d -r trustRoot -p codeSign -k /Library/Keychains/System.keychain /tmp/bridle-signing.pem (if /tmp/bridle-signing.pem is gone: security find-certificate -c "bridle local signing" -p > /tmp/bridle-signing.pem first).

Check: security dump-trust-settings -d lists 'bridle local signing'. Until then, each bridle self-upgrade can block the gateway from other machines again (fix then: socketfilterfw --remove/--add/--unblockapp ~/.cargo/bin/bridle and kickstart the gateway). The human, 2026-11-21: "Ok. Later then."
