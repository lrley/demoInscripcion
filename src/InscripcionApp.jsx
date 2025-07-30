import { useRef, useState } from "react";
import { CameraCapture } from "./CameraCapture";
import { isEmail, isNumeric, isRequired, maxLength, minLength } from "./helpers/validadorDeInputs";
import { InscripcionUsuario } from "./ApiConecctions/envioFormulario";

export const InscripcionApp = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    documento: "",
    correo: "",
    telefono: "",
    foto: null,
    aceptaTerminos: false,
  });

  const [previewFoto, setPreviewFoto] = useState(null);
  const [usarCamara, setUsarCamara] = useState(false);
  const [errors, setErrors] = useState({});
  const [mostrarTerminos, setMostrarTerminos] = useState(false);

  const inputRefs = {
    nombre: useRef(null),
    correo: useRef(null),
    telefono: useRef(null),
    documento: useRef(null),
  };

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // Si selecciona foto desde galería, cerramos la cámara
    if (type === "file") {
      handleCerrarCamara();
      const file = files[0];
      setFormData({ ...formData, foto: file });
      setPreviewFoto(URL.createObjectURL(file));
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCapture = (imageData) => {
    // Al capturar foto desde cámara, eliminamos cualquier foto de galería anterior
    setFormData({ ...formData, foto: imageData });
    setPreviewFoto(imageData);
    setUsarCamara(false);
  };

  const handleUsarCamara = () => {
    setPreviewFoto(null);
    setFormData({ ...formData, foto: null });
      if (fileInputRef.current) {
    fileInputRef.current.value = ""; // Limpia el input file visualmente
  }
    setUsarCamara(true);
  };

  const handleCerrarCamara = () => {
    setUsarCamara(false);
    // Solo cerramos la cámara, no borramos la foto seleccionada
  };

  const validate = (formData) => {
    const errors = {};

    let error = isRequired(formData.correo, 'correo');
    if (!error) error = isEmail(formData.correo);
    if (!error) error = maxLength(formData.correo, 35, 'correo');
    if (error) errors.correo = error;

    error = isRequired(formData.nombre, 'Nombre');
    if (!error) error = minLength(formData.nombre, 4, 'Nombre');
    if (!error) error = maxLength(formData.nombre, 40, 'Nombre');
    if (error) errors.nombre = error;

    error = isRequired(formData.telefono, 'telefono');
    if (!error) error = isNumeric(formData.telefono, 'Teléfono');
    if (!error) error = minLength(formData.telefono, 10, 'telefono');
    if (!error) error = maxLength(formData.telefono, 16, 'telefono');
    if (error) errors.telefono = error;

    error = isRequired(formData.documento, 'documento');
    if (!error) error = isNumeric(formData.documento, 'documento');
    if (!error) error = minLength(formData.documento, 10, 'documento');
    if (!error) error = maxLength(formData.documento, 13, 'documento');
    if (error) errors.documento = error;

    if (!formData.aceptaTerminos) {
      errors.aceptaTerminos = 'Debes aceptar los términos y condiciones.';
    }

    setErrors(errors);
    return errors;
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      correo: "",
      telefono: "",
      documento: "",
      foto: null,
      aceptaTerminos: false,
    });
    fileInputRef.current.value = ""
    setPreviewFoto(null);
    setErrors({});
    setUsarCamara(false);
    setMostrarTerminos(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(formData);
    const errorKeys = Object.keys(validationErrors);
    if (errorKeys.length > 0) {
      const firstErrorKey = errorKeys[0];
      if (inputRefs[firstErrorKey] && inputRefs[firstErrorKey].current) {
        inputRefs[firstErrorKey].current.focus();
      }
      alert(validationErrors[firstErrorKey]);
      return;
    }

    if (!formData.aceptaTerminos) {
      alert("Debe aceptar los términos y condiciones antes de inscribirse.");
      return;
    }

    const inscripcionAPI = await InscripcionUsuario(
      formData.documento,
      formData.nombre,
      formData.telefono,
      formData.correo,
      formData.foto
    );
    console.log(inscripcionAPI);

    alert(`Datos enviados:
      \nNombre: ${formData.nombre}
      \nDocumento: ${formData.documento}
      \nCorreo: ${formData.correo}
      \nTeléfono: ${formData.telefono}
    `);
    resetForm();
  };

  return (
    <div className="form-container">
      <h1>Inscripcion de Usuario</h1>
      <form className="inscripcion-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombres Completos"
          value={formData.nombre}
          onChange={handleChange}
          ref={inputRefs.nombre}
          required
        />
        <input
          type="text"
          name="documento"
          placeholder="Cedula"
          value={formData.documento}
          onChange={handleChange}
          ref={inputRefs.documento}
          required
        />
        <input
          type="email"
          name="correo"
          placeholder="Email"
          value={formData.correo}
          onChange={handleChange}
          ref={inputRefs.correo}
          required
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Telefono"
          value={formData.telefono}
          onChange={handleChange}
          ref={inputRefs.telefono}
          required
        />

        <label className="foto-label">
          Foto (Usar Imagen de su Dispositivo)
          <input
            className="foto-input"
            type="file"
            name="foto"
            accept="image/*"
            onChange={handleChange}
            ref={fileInputRef}
            required={!previewFoto}
          />
        </label>

        <button type="button" onClick={handleUsarCamara} className="button-foto">
          Tomar Foto
        </button>

        {usarCamara && <CameraCapture onCapture={handleCapture} onClose={handleCerrarCamara} />}

        {previewFoto && (
          <div className="preview-container">
            <img src={previewFoto} alt="Vista previa" className="preview-image" />
          </div>
        )}

        <div className="terminos-section">
          <a href="#" onClick={(e) => { e.preventDefault(); setMostrarTerminos(!mostrarTerminos); }}>
            {mostrarTerminos ? 'Terminos y Condiciones' : 'Mostrar Terminos y Condiciones'}
          </a>

          {mostrarTerminos && (
            <div className="terminos-text">
             <><p><strong>AL ACEPTAR ESTOS TÉRMINOS, USTED AUTORIZA EXPRESAMENTE A LA APLICACIÓN A RECOLECTAR, ALMACENAR Y UTILIZAR SU INFORMACIÓN PERSONAL, INCLUIDA SU IMAGEN BIOMÉTRICA (FOTOGRAFÍA), CON FINES DE IDENTIFICACIÓN Y CONTROL DE ACCESO A LA CIUDADELA.</strong></p>

<p><strong>1. Consentimiento para uso de datos personales:</strong> El usuario acepta que, al registrarse en la aplicación, proporciona voluntariamente sus datos personales, incluyendo nombre, número de cédula, correo electrónico, número de teléfono y una fotografía tomada desde la cámara del dispositivo.</p>

<p><strong>2. Uso de imagen para control biométrico:</strong> Durante el proceso de inscripción, la aplicación capturará una fotografía del rostro del usuario. Esta imagen será utilizada únicamente para el reconocimiento facial en el sistema de control de acceso biométrico de la ciudadela o etapa residencial.</p>

<p><strong>3. Acceso mediante identificación facial:</strong> Cuando el usuario se acerque al lector biométrico y se registre su rostro, el sistema verificará su identidad. Si la verificación es exitosa, se le concederá el acceso a la ciudadela.</p>

<p><strong>4. Eliminación inmediata de la imagen:</strong> La imagen facial utilizada para el reconocimiento será <strong>eliminada automáticamente</strong> del sistema inmediatamente después de realizada la verificación. Esta imagen <strong>no será almacenada permanentemente</strong>, ni utilizada para ningún otro propósito.</p>

<p><strong>5. Uso exclusivo para control de acceso:</strong> La imagen biométrica del usuario <strong>no será compartida, transferida ni utilizada con ningún fin externo</strong>, y se empleará únicamente para el control de ingreso a la ciudadela o etapa donde reside.</p>

<p><strong>6. Protección y confidencialidad:</strong> Los datos personales tratados en este proceso estarán protegidos mediante medidas técnicas y administrativas adecuadas para garantizar su confidencialidad, integridad y uso legítimo.</p>

<p><strong>7. Derechos del usuario:</strong> El usuario tiene derecho a acceder, rectificar o eliminar sus datos personales en cualquier momento, conforme a la legislación aplicable, contactando a la administración a través del correo: <a href="mailto:proyectos@dley.com.ec">proyectos@dley.com.ec</a>.</p>

<p><strong>8. Aceptación:</strong> Al continuar con el proceso de registro y marcar la opción de aceptación, el usuario declara haber leído, comprendido y aceptado estos Términos y Condiciones, y autoriza expresamente la captura y uso de su imagen para los fines indicados.</p></>
      
            </div>
          )}
        </div>

        <div className="aceptacion-checkbox">
          <label htmlFor="aceptaTerminos" className="aceptacion-checkbox">
            <input
              type="checkbox"
              id="aceptaTerminos"
              name="aceptaTerminos"
              checked={formData.aceptaTerminos}
              onChange={handleChange}
              required
            />
            <span>Acepto los Terminos y condiciones</span>
          </label>
          {errors.aceptaTerminos && (
            <div className="error-message">{errors.aceptaTerminos}</div>
          )}
        </div>

        <button type="submit" className="submit-button">
          Registrar
        </button>
      </form>
    </div>
  );
};