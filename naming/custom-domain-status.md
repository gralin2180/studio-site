# Custom domain — 22 October 2026

Live: https://codermanstudios.com
Vercel project: pinekraftstudios/studio-site
Deployment: dpl_6oMz17qAfcXERcgpidg7QqijvMXr

Namecheap BasicDNS retained. Replaced default parking CNAME and URL redirect with:
- A @ 216.198.79.1
- A @ 64.29.17.1
- CNAME www 1d1b690adcf68ea0.vercel-dns-017.com.
Email forwarding/SPF settings preserved.

Both domains pass Vercel domain verification. HTTPS apex returns 200. www domain redirects 308 to https://codermanstudios.com/ (configured on Vercel project domain). Canonical URL updated. AI origin allowlist and provider referer updated. Public AI endpoint tested from new origin: 200 with real answer. Build and API validation checks pass.
