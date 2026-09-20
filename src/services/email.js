import emailjs from "@emailjs/browser";

export async function sendContactEmail(
  form
) {

  const serviceId =
    import.meta.env
      .VITE_EMAILJS_SERVICE_ID;

  const templateId =
    import.meta.env
      .VITE_EMAILJS_TEMPLATE_ID;

  const publicKey =
    import.meta.env
      .VITE_EMAILJS_PUBLIC_KEY;

  if (
    !serviceId ||
    !templateId ||
    !publicKey
  ) {

    throw new Error(
      "EmailJS environment variables are not configured."
    );
  }

  return emailjs.send(
    serviceId,
    templateId,
    {
      from_name: form.name,
      reply_to: form.email,
      subject: form.subject,
      message: form.message
    },
    {
      publicKey
    }
  );
}