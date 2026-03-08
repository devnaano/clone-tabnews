function status(request, response) {
  response.status(200).json({ chave: "Funcionando meu patrão" });
}

export default status;
