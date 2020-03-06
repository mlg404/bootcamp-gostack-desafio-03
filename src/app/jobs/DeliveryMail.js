import Mail from '../../lib/mail';

class DeliveryMail {
  get key() {
    return 'DeliveryMail';
  }

  // tarefa a executar quando a fila for executada
  async handle({ data }) {
    const { name, email, product } = data;
    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Nova encomenda disponível',
      template: 'delivery',
      context: {
        name,
        product,
      },
    });
  }
}

export default new DeliveryMail();
