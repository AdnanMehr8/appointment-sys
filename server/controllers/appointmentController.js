const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAppointments = async (req, res) => {
  const { userId, role } = req.user;
  const { page = 1, limit = 10, status, fromDate, toDate } = req.query;

  const where = {
    ...(role === 'CUSTOMER' ? { customerId: userId } : { providerId: userId }),
    ...(status ? { status } : {}),
    ...(fromDate && toDate
      ? {
          date: {
            gte: new Date(fromDate),
            lte: new Date(toDate),
          },
        }
      : {}),
  };

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: {
        provider: { select: { name: true } },
        customer: { select: { name: true } },
      },
      orderBy: { date: 'asc' },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    }),
    prisma.appointment.count({ where }),
  ]);

  res.json({
    data: appointments,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
};


exports.bookAppointment = async (req, res) => {
  const { providerId, date } = req.body;
  const customerId = req.user.userId;

  const availability = await prisma.availability.findFirst({
    where: {
      providerId,
      startTime: new Date(date),
      booked: false,
    },
  });

  if (!availability) {
    return res.status(409).json({ message: 'Slot already booked or invalid.' });
  }

  const appointment = await prisma.appointment.create({
    data: {
      providerId,
      customerId,
      availabilityId: availability.id, 
      date: new Date(date),
      status: 'BOOKED',
    },
  });

  await prisma.availability.update({
    where: { id: availability.id },
    data: { booked: true },
  });

  res.status(201).json(appointment);
};

exports.cancelAppointment = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const appt = await prisma.appointment.findUnique({
    where: { id: Number(id) },
    select: {
      customerId: true,
      availabilityId: true,
    },
  });

  if (!appt || appt.customerId !== userId) {
    return res.status(403).json({ message: 'Not allowed' });
  }

  if (appt.availabilityId) {
    await prisma.availability.update({
      where: { id: appt.availabilityId },
      data: { booked: false },
    });
  } else {
    console.warn('No availabilityId found for this appointment. Skipping availability update.');
  }

  await prisma.appointment.delete({ where: { id: Number(id) } });

  res.json({ message: 'Appointment cancelled' });
};

