export default {
  slugify(input) {
    if (!input) {
      return input;
    }

    return input.toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-');
  }
}
