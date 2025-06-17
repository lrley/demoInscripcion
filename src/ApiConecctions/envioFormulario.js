export const InscripcionUsuario = async (documento, nombres, telefono, email, foto) => {
  let sexo = 'M';
  
  try {
    const formData = new FormData();
    formData.append('documento', documento);
    formData.append('nombres', nombres);
    formData.append('sexo', sexo);
    formData.append('telefono', telefono);
    formData.append('email', email);

    // Si la foto es base64, conviértela a Blob
    if (typeof foto === 'string' && foto.startsWith('data:image')) {
      console.log('Es base64');
      const res = await fetch(foto);
      const blob = await res.blob();
      formData.append('foto', blob, 'foto.png');
    } else {
     // console.log('Se fue por el else');
      formData.append('foto', foto);
    }

   /*  // Verificamos que el FormData esté bien armado
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ', pair[1]);
    } */

    const respuesta = await fetch(`https://apidemo.dlaccess.net/aiface/crearusuario`, {
      method: 'POST',
      body: formData, // ✅ Aquí sí estás enviando el FormData correctamente
    });

    const dataToken = await respuesta.json();
    if (!respuesta.ok) {
      throw new Error(dataToken.msg || 'Error al enviar datos');
    }

    return dataToken;

  } catch (error) {
    console.log('Error al enviar el formulario', error.message);
  }
};