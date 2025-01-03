<script lang="ts">
  import HeadlessNav from "$lib/components/HeadlessNav.svelte";
  import { marked } from "marked";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  let privacyHtml = marked(
    `## Privacy Policy

### Effective Date: 03/01/2025

F3AST ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect information about you when you use our Platform.

---

### 1. Information We Collect

1.1. **Information You Provide:**

- Account information, such as your name, email address, and payment details.
- Business information, including menu details and customer inquiries.

1.2. **Automatically Collected Information:**

- Device information, such as IP address and browser type.
- Usage data, such as page views and interactions with the Platform.

1.3. **Cookies and Tracking Technologies:**

- We use cookies to improve user experience and analyze Platform usage. You can control cookies through your browser settings.

---

### 2. How We Use Your Information

2.1. To provide and improve our services.

2.2. To process payments and manage subscriptions.&#x20;

2.3. To communicate with you about updates, promotions, and customer support.&#x20;

2.4. To analyze Platform usage and improve functionality.&#x20;

2.5. To comply with legal obligations.

---

### 3. Sharing of Information

We may share your information in the following circumstances:

3.1. **Service Providers:**

- With third-party vendors who assist in payment processing, data analysis, and service provision.

3.2. **Legal Requirements:**

- When required by law or to protect our legal rights.

3.3. **Business Transfers:**

- In connection with a merger, sale, or other business transaction involving F3AST.

---

### 4. Your Rights

You have the following rights regarding your personal information:

4.1. Access and correction of your data.

4.2. Deletion of your account and associated data.

4.3. Opting out of marketing communications.

4.4. Restriction of certain data processing activities.

To exercise your rights, please contact us at [lachlan@f3ast.com](mailto\:lachlan@f3ast.com).

---

### 5. Data Retention

We retain your information as long as necessary to fulfill the purposes outlined in this Privacy Policy or as required by law.

---

### 6. Security

We implement appropriate technical and organizational measures to protect your information from unauthorized access, loss, or misuse. However, no method of transmission over the internet is 100% secure.

---

### 7. International Data Transfers

If you access the Platform from outside Australia, please be aware that your information may be transferred to and processed in Australia, where data protection laws may differ from those in your jurisdiction.

---

### 8. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the updated policy on our Platform. Continued use of the Platform after changes constitutes your acceptance of the updated Privacy Policy.

---

### 9. Contact Information

If you have questions or concerns about this Privacy Policy, please contact us at:

- **Email:** [lachlan@f3ast.com](mailto\:lachlan@f3ast.com)

---

Thank you for trusting F3AST with your information.
`
  );
</script>

<div class="prose mx-auto p-4 my-16">
  {@html privacyHtml}
</div>

<HeadlessNav />
