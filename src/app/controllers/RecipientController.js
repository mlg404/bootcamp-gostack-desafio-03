import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zipcode: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipientExists = await Recipient.findOne({
      where: { name: req.body.name },
    });
    if (recipientExists) {
      return res.status(401).json({ error: 'Recipient already registered' });
    }
    const recipient = await Recipient.create(req.body);
    return res.json(recipient);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.number(),
      complement: Yup.string(),
      state: Yup.string().max(2),
      city: Yup.string(),
      zipcode: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipient = await Recipient.findByPk(req.params.id);
    if (!recipient) {
      return res.status(400).json({ error: 'No Recipient found' });
    }
    const recipientUpdate = await recipient.update(req.body);
    return res.json(recipientUpdate);
  }

  async show(req, res) {
    const recipients = await Recipient.findAll();
    if (!recipients) {
      return res.status(200).json({});
    }
    return res.json(recipients);
  }

  async index(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);
    if (!recipient) {
      return res.status(400).json({ error: 'No Recipient found' });
    }
    return res.json(recipient);
  }

  async destroy(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);
    if (!recipient) {
      return res.status(400).json({ error: 'No Recipient found' });
    }
    await recipient.destroy();
    return res.json({ message: 'Recipient deleted.' });
  }
}

export default new RecipientController();
