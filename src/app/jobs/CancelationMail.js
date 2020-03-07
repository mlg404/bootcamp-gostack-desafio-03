import Mail from '../../lib/mail';

class CancelationMail {
  get key() {
    return 'CancelationMail';
  }

  async handle({ data }) {
    const { name, email, product, description } = data;
    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Entrega cancelada',
      template: 'cancelation',
      context: {
        name,
        product,
        description,
      },
    });
  }
}

export default new CancelationMail();
