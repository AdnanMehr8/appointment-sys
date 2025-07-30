const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAvailability = async (req, res) => {
  const { providerId } = req.query;

  const availability = await prisma.availability.findMany({
    where: {
      ...(providerId ? { providerId: Number(providerId) } : {}),
      booked: false,
    },
    include: {
      provider: { select: { id: true, name: true } },
    },
    orderBy: { startTime: 'asc' },
  });

  res.json(availability);
};


exports.setAvailability = async (req, res) => {
  const { startTime, endTime } = req.body;
  const providerId = req.user.userId;

  const slot = await prisma.availability.create({
    data: {
      providerId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    },
  });

  res.status(201).json(slot);
};

exports.getMyAvailability = async (req, res) => {
  const providerId = req.user.userId;

  const availability = await prisma.availability.findMany({
    where: { providerId },
    orderBy: { startTime: 'asc' },
  });

  res.json(availability);
};

exports.deleteAvailability = async (req, res) => {
  const id = Number(req.params.id);
  const providerId = req.user.userId;

  const slot = await prisma.availability.findUnique({ where: { id } });
  if (!slot || slot.providerId !== providerId)
    return res.status(403).json({ message: 'Not allowed' });

  if (slot.booked)
    return res.status(400).json({ message: 'Cannot delete a booked slot' });

  await prisma.availability.delete({ where: { id } });
  res.json({ message: 'Deleted' });
};

exports.updateAvailability = async (req, res) => {
  const id = Number(req.params.id);
  const { startTime, endTime } = req.body;
  const providerId = req.user.userId;

  const slot = await prisma.availability.findUnique({ where: { id } });
  if (!slot || slot.providerId !== providerId)
    return res.status(403).json({ message: 'Not allowed' });

  if (slot.booked)
    return res.status(400).json({ message: 'Cannot edit a booked slot' });

  const updated = await prisma.availability.update({
    where: { id },
    data: { startTime: new Date(startTime), endTime: new Date(endTime) },
  });

  res.json(updated);
};
