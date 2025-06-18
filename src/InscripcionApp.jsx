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
      <h1>Court Booking Registration Form</h1>
      <form className="inscripcion-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Full Name"
          value={formData.nombre}
          onChange={handleChange}
          ref={inputRefs.nombre}
          required
        />
        <input
          type="text"
          name="documento"
          placeholder="Document"
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
          placeholder="Phone"
          value={formData.telefono}
          onChange={handleChange}
          ref={inputRefs.telefono}
          required
        />

        <label className="foto-label">
          Photo (can use the camera)
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
          Take a photo
        </button>

        {usarCamara && <CameraCapture onCapture={handleCapture} onClose={handleCerrarCamara} />}

        {previewFoto && (
          <div className="preview-container">
            <img src={previewFoto} alt="Vista previa" className="preview-image" />
          </div>
        )}

        <div className="terminos-section">
          <a href="#" onClick={(e) => { e.preventDefault(); setMostrarTerminos(!mostrarTerminos); }}>
            {mostrarTerminos ? 'Hide Terms and Conditions' : 'See Terms and Conditions'}
          </a>

          {mostrarTerminos && (
            <div className="terminos-text">
              {/* Aquí va todo tu texto de términos y condiciones */}
              {/* ... */}
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
            <span>I accept the Terms and Conditions</span>
          </label>
          {errors.aceptaTerminos && (
            <div className="error-message">{errors.aceptaTerminos}</div>
          )}
        </div>

        <button type="submit" className="submit-button">
          Register
        </button>
      </form>
    </div>
  );
};