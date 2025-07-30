const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.createPaymentSession = async (req, res) => {
  const { appointmentId } = req.body;

  const appointment = await prisma.appointment.findUnique({
    where: { id: Number(appointmentId) },
  });

  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  const fakePaymentURL = `${process.env.Client_URL}/payment-success?appointmentId=${appointmentId}`;

  res.json({ url: fakePaymentURL });
};

exports.mockWebhook = async (req, res) => {
  const { appointmentId } = req.body;

  await prisma.appointment.update({
    where: { id: Number(appointmentId) },
    data: { paid: true },
  });

  res.json({ message: 'Payment simulated and appointment marked as paid' });
};
