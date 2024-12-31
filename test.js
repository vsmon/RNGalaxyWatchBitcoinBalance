const texto = '150,000.50';
const numero = parseFloat(texto.replace('.', ',')).toLocaleString(undefined, {
  maximumFractionDigits: 2,
});
console.log(numero);
