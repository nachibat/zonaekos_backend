const uriTransformation = (cadena) => {
    cadena = cadena.toLocaleLowerCase();
    cadena = cadena.toLocaleLowerCase();
    cadena = cadena.replace(/[`´ç&\/\\#,+()$~%€.'":*?<>{}ºª!|[\]"@·¬=¡¿;_\-]/g, '');
    cadena = cadena.replace(/[àá]/g, 'a');
    cadena = cadena.replace(/[èé]/g, 'e');
    cadena = cadena.replace(/[ìí]/g, 'i');
    cadena = cadena.replace(/[òó]/g, 'o');
    cadena = cadena.replace(/[ùú]/g, 'u');
    cadena = cadena.replace(/[ñ]/g, 'ni');
    cadena = cadena.replace(/\s+/g, '-');
    return cadena;
}

module.exports = {
    uriTransformation
}