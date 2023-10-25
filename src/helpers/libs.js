// Exporta una función llamada "randomNumber"
export const randomNumber = () => {
  // Define una cadena de caracteres que contiene letras minúsculas y números
  const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  let randomNumber = 0; // Inicializa una cadena vacía para almacenar el resultado

  // Genera una cadena aleatoria de 6 caracteres
  for (let i = 0; i < 6; i++) {
    // Selecciona aleatoriamente un carácter de la cadena "possible" y lo agrega a "randomNumber"
    randomNumber += possible.charAt(
      Math.floor(Math.random() * possible.length)
    );
  }

  return randomNumber; // Devuelve la cadena aleatoria de 6 caracteres
};
