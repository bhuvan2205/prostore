const payPalUrl = process.env.PAYPAL_API_URL;
const payPalClientId = process.env.PAYPAL_CLIENT_ID;
const payPalSecretKey = process.env.PAYPAL_SECRET_ID;

const handleApiResponse = async (response: Response) => {
  if (response.ok) {
    return await response.json();
  } else {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
};

export const generateAccessToken = async () => {
  const auth = Buffer.from(`${payPalClientId}:${payPalSecretKey}`).toString(
    "base64"
  );

  const response = await fetch(`${payPalUrl}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const jsonData = await handleApiResponse(response);
  return jsonData.access_token;
};

export const paypal = {
  createOrder: async function createOrder(price: number) {
    const accessToken = await generateAccessToken();
    const apiUrl = `${payPalUrl}/v2/checkout/orders`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: price,
            },
          },
        ],
      }),
    });

    return handleApiResponse(response);
  },
  capturePayment: async function capturePayment(orderId: string) {
    const accessToken = await generateAccessToken();
    const apiUrl = `${payPalUrl}/v2/checkout/orders/${orderId}/capture`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return handleApiResponse(response);
  },
};
