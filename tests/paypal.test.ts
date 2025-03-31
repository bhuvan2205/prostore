import { generateAccessToken, paypal } from "../src/lib/paypal";

// test to generate Access token
test("generate token from paypal", async () => {
  const accessToken = await generateAccessToken();

  expect(typeof accessToken).toBe("string");
  expect(accessToken.length).toBeGreaterThan(0);
});

// test to generate Order
test("generate order", async () => {
  const price = 10.0;
  const order = await paypal.createOrder(price);

  expect(order).toHaveProperty("id");
  expect(order).toHaveProperty("status");
  expect(order.status).toBe("CREATED");
});

// test to capture payment using mock order
test("simulate capturing a payment from an order", async () => {
  const orderId = "1013";
  const mockCapturePayment = jest
    .spyOn(paypal, "capturePayment")
    .mockResolvedValue({ status: "COMPLETED" });

  const captureResponse = await paypal.capturePayment(orderId);

  expect(captureResponse).toHaveProperty("status", "COMPLETED");
  mockCapturePayment.mockRestore();
});
