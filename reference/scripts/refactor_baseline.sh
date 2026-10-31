#!/usr/bin/env bash
# Refactor safety net, part 1 (static): typecheck, lint totals, production build, bundle size, and the
# set of registered screens. Run from vfq-dxp-app/ before and after each refactor phase and diff the output:
#   bash reference/scripts/refactor_baseline.sh > $TMPDIR/after.txt; diff reference/outputs/Refactor_Baseline.txt $TMPDIR/after.txt
# Uses only tools already in the project (tsc, oxlint, vite). Part 2 (rendered UI) is
# reference/scripts/refactor_ui_capture.js, run in the browser via the preview tool.
set -u
cd "$(dirname "$0")/../.."
echo "== typecheck (tsc -b)"; if npx tsc -b >/dev/null 2>&1; then echo PASS; else echo FAIL; fi
echo "== lint (oxlint) summary"; lint=$(npx oxlint 2>&1); echo "warnings: $(echo "$lint" | grep -c ': warning')"; echo "errors: $(echo "$lint" | grep -c ': error')"
echo "== build (vite build)"; out=$(npx vite build 2>&1); echo "$out" | grep -q "built in" && echo PASS || echo FAIL
echo "== bundle files (name, bytes)"; ls -l dist/assets 2>/dev/null | awk 'NR>1{print $9, $5}' | sed -E 's/-[A-Za-z0-9_-]{8}\./-HASH./' | sort
echo "== registered screens"; grep -rhoE "registerScreen\('SCR-[0-9]+'" src | sort | uniq | wc -l
echo "== source files / lines"; find src -name '*.ts' -o -name '*.tsx' | wc -l; find src -name '*.ts' -o -name '*.tsx' | xargs cat | wc -l
