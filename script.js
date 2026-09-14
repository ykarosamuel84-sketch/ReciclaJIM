const form = document.querySelector('#form');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  emailjs.init({
    publicKey: "ngMihWippJuMdxlfh",
  });

  emailjs.sendForm("service_gti544t", "template_vpg842g", form)
    .then((response) => alert("Mensagem enviada com sucesso!"))
    .catch((error) => {
      console.log(error);
      alert("Erro ao enviar mensagem!")
    });
});