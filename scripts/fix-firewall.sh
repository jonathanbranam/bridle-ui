#!/bin/sh
# Re-registers the bridle binary with the macOS application firewall. Each build of bridle gets a
# new ad-hoc signature, and the firewall's "allow incoming" no longer matches it, so the gateway
# and the daemons stop answering other machines (they still answer on this one). Run after a
# rebuild breaks remote access: `sudo scripts/fix-firewall.sh`. Not needed once bridle is signed
# with a stable certificate (bridle ticket p88z).
set -eu

if [ "$(id -u)" -ne 0 ]; then
	echo "run with sudo: sudo $0" >&2
	exit 1
fi

# Under sudo, ~ is root's home; the binary is in the invoking user's.
user="${SUDO_USER:-$(id -un)}"
bin="${1:-$(eval echo "~$user")/.cargo/bin/bridle}"
if [ ! -x "$bin" ]; then
	echo "no bridle binary at $bin (pass its path as the first argument)" >&2
	exit 1
fi

fw=/usr/libexec/ApplicationFirewall/socketfilterfw
"$fw" --remove "$bin"
"$fw" --add "$bin"
"$fw" --unblockapp "$bin"
echo "Re-registered $bin. Reload the page; restart \`bridle gateway\` if it still hangs."
