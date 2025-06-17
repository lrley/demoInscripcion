import { useRef, useState } from "react";
import { CameraCapture } from "./CameraCapture";
import { isEmail, isNumeric, isRequired, maxLength, minLength } from "./helpers/validadorDeInputs";
import { InscripcionUsuario } from "./ApiConecctions/envioFormulario";

export const InscripcionApp = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    documento:"",
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
    documento:useRef(null),
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
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
    setFormData({ ...formData, foto: imageData });
    setPreviewFoto(imageData);
    setUsarCamara(false);
  };

  const handleUsarCamara = () => {
    setPreviewFoto(null);
    setFormData({ ...formData, foto: null });
    setUsarCamara(true);
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

    setErrors(errors);
    return errors;
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      correo: "",
      telefono: "",
      documento:"",
      foto: null,
      aceptaTerminos: false,
    });
    setPreviewFoto(null);
    setErrors({});
    setUsarCamara(false);
    setMostrarTerminos(false);
  };

  const handleSubmit = async(e) => {
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


const inscripcionAPI= await InscripcionUsuario(formData.documento,formData.nombre,formData.telefono,formData.correo, formData.foto )
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
      <h1>Formulario de Inscripción a la Cancha</h1>
      <form className="inscripcion-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={formData.nombre}
          onChange={handleChange}
          ref={inputRefs.nombre}
          required
        />
           <input
          type="text"
          name="documento"
          placeholder="Documento"
          value={formData.documento}
          onChange={handleChange}
          ref={inputRefs.documento}
          required
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          value={formData.correo}
          onChange={handleChange}
          ref={inputRefs.correo}
          required
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          ref={inputRefs.telefono}
          required
        />

        <label className="foto-label">
          Foto (puede usar la cámara)
          <input
            type="file"
            name="foto"
            accept="image/*"
            onChange={handleChange}
            required={!previewFoto}
          />
        </label>

        <button type="button" onClick={handleUsarCamara}>
          Tomar foto con cámara
        </button>

        {usarCamara && <CameraCapture onCapture={handleCapture} />}

        {previewFoto && (
          <div className="preview-container">
            <img src={previewFoto} alt="Vista previa" className="preview-image" />
          </div>
        )}

        <div className="terminos-section">
          <a href="#" onClick={(e) => { e.preventDefault(); setMostrarTerminos(!mostrarTerminos); }}>
            {mostrarTerminos ? 'Ocultar Términos y Condiciones' : 'Ver Términos y Condiciones'}
          </a>

          {mostrarTerminos && (
            <div className="terminos-text">
              {/* Aquí va todo tu texto de términos y condiciones */}
              <p><strong>Aceptación de Riesgos y Exención de Responsabilidad</strong></p>
              <p>Al reservar y utilizar las instalaciones de [Nombre de tu Cancha], el usuario declara haber leído, entendido y aceptado los siguientes términos:</p>
              <p><strong>Asunción de Riesgos</strong></p>
              <p>El usuario reconoce y acepta que la práctica de deportes y actividades físicas puede implicar riesgos de lesiones físicas, daños materiales, e incluso la muerte...</p>
                <p><strong>Exención de Responsabilidad</strong></p>
              <p>
                [Nombre de tu Cancha], sus propietarios, empleados, agentes y afiliados no serán responsables por ninguna lesión personal, daño material, pérdida, accidente, enfermedad, discapacidad, o cualquier otra situación adversa que pueda ocurrir antes, durante o después del uso de las instalaciones, sin importar la causa.
              </p>
              <p><strong>Renuncia a Reclamaciones</strong></p>
              <p>
                El usuario, en su nombre y en nombre de sus herederos, familiares, representantes legales y aseguradoras, renuncia expresamente a cualquier derecho a presentar reclamaciones, demandas, acciones legales o solicitudes de indemnización contra [Nombre de tu Cancha] por cualquier evento relacionado con el uso de las instalaciones.
              </p>
              <p><strong>Uso Responsable de la Cancha</strong></p>
              <p>
                El usuario se compromete a utilizar la cancha de manera responsable y a seguir todas las reglas y normativas establecidas por [Nombre de tu Cancha]. El incumplimiento de estas reglas podrá resultar en la terminación inmediata del derecho de uso sin reembolso.
              </p>
              <p><strong>Protección de Datos</strong></p>
              <p>
                Al registrarse, el usuario autoriza el uso de sus datos personales únicamente para fines administrativos y de comunicación relacionados con la reserva y uso de las instalaciones.
              </p>
              <p><strong>Aceptación de Términos</strong></p>
              <p>
                Al continuar con la inscripción o el alquiler de la cancha, el usuario declara que ha leído, entendido y acepta estos Términos y Condiciones y que lo hace de manera voluntaria y consciente, liberando a [Nombre de tu Cancha] de toda responsabilidad legal.
              </p>
              {/* Agrega todo tu texto aquí */}
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
              <span>Acepto los Términos y Condiciones</span>
            </label>
          </div>

        <button type="submit" className="submit-button">
          Inscribirse
        </button>
      </form>
    </div>
  );
};