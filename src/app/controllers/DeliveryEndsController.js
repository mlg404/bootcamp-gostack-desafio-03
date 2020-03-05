import Delivery from '../models/Delivery';
import File from '../models/File';

class DeliveryEndsController {
  async update(req, res) {
    const nowDate = new Date();

    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) {
      return res.status(401).json({ error: 'Delivery not found' });
    }

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    const updateDelivery = await delivery.update({
      signature_id: file.id,
      end_date: nowDate,
    });

    return res.json(updateDelivery);
  }
}
export default new DeliveryEndsController();
