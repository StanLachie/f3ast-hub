<script lang="ts">
  import HeadlessNav from "$lib/components/HeadlessNav.svelte";
  import type { PageData } from "./$types";
  import { marked } from "marked";

  let { data }: { data: PageData } = $props();
  let termsHtml = marked(
    `## Terms of Service

### Effective Date: 03/01/2025

Welcome to F3AST ("the Platform"). These Terms of Service ("Terms") govern your access to and use of our Platform and services. By using our Platform, you agree to these Terms. If you do not agree, you may not use our Platform.

---

### 1. Services Provided

The Platform allows business owners to:

1.1. Publish an online menu for their customers to view. \n
1.2. Receive inquiries from customers via the Platform. \n
1.3. Choose between two subscription plans: Basic and Elite.

---

### 2. User Eligibility

2.1. You must be at least 18 years old to use the Platform. \n
2.2. By registering an account, you represent that all information provided is accurate and complete. \n

---

### PO3. Subscriptions and Payments

3.1. Subscription Plans: \n

- **Basic Plan:** Access to core features, such as online menu publishing. \n
- **Elite Plan:** Additional features, including receiving customer inquiries & access to our AI tools.

3.2. Payment Terms:

- Subscription fees are billed monthly or annually. Users may switch between billing cycles during their subscription term by contacting customer support.
- Payments are non-refundable unless required by applicable law.

3.3. Changes to Subscription:

- Upgrades or downgrades may affect your billing cycle and fees.
- Changes take effect at the start of the next billing cycle.

---

### 4. User Responsibilities

4.1. You are responsible for maintaining the accuracy of your menu and business information. \n
4.2. You may not: \n

- Post false or misleading information. \n
- Use the Platform for unlawful activities. \n
- Share your login credentials with others. \n

4.3. You are responsible for responding to customer inquiries in a timely and professional manner.

---

### 5. Prohibited Activities

You agree not to:

5.1. Attempt to hack or interfere with the Platform’s functionality.
5.2. Upload harmful content, including viruses or malware.
5.3. Use automated tools to access the Platform.

---

### 6. Intellectual Property

6.1. The Platform and its content are the property of F3AST.

6.2. You retain ownership of your menus content and business information but grant us a license to display it on the Platform.

---

### 7. Termination

7.1. We reserve the right to terminate your access to the Platform for:

- Breaches of these Terms.
- Non-payment of subscription fees.

7.2. You may terminate your account at any time by contacting us.

---

### 8. Limitation of Liability

8.1. We provide the Platform on an "as is" basis and make no guarantees regarding its availability or performance. \n
8.2. To the fullest extent permitted by law, we are not liable for any damages resulting from your use of the Platform.

---

### 9. Indemnification

You agree to indemnify and hold us harmless from any claims or damages arising out of your use of the Platform or breach of these Terms.

---

### 10. Governing Law

These Terms are governed by the laws of Australia.

---

### 11. Amendments

We may update these Terms from time to time. Continued use of the Platform after changes constitute your acceptance of the new Terms.

---

### 12. Contact Information

For questions about these Terms, please contact us at [lachlan@f3ast.com](mailto\:lachlan@f3ast.com).

`
  );
</script>

<div class="prose mx-auto p-4 my-16">
  {@html termsHtml}
</div>

<HeadlessNav />
