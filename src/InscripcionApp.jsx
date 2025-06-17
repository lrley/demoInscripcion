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
            type="file"
            name="foto"
            accept="image/*"
            onChange={handleChange}
            required={!previewFoto}
          />
        </label>

        <button type="button" onClick={handleUsarCamara}>
         Take a photo with a camera
        </button>

        {usarCamara && <CameraCapture onCapture={handleCapture} />}

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
             <p><strong>Acceptance of Risks and Disclaimer of Liability</strong></p>
<p>By reserving and using the facilities of [Your Court Name], the user declares that they have read, understood, and accepted the following terms:</p>
<p><strong>Assumption of Risks</strong></p>
<p>The user acknowledges and accepts that engaging in sports and physical activities may involve risks of physical injury, property damage, or even death.</p>
<p><strong>Disclaimer of Liability</strong></p>
<p>[Your Court Name], its owners, employees, agents, and affiliates shall not be held responsible for any personal injury, property damage, loss, accident, illness, disability, or any other adverse situation that may occur before, during, or after using the facilities, regardless of the cause.</p>
<p><strong>Waiver of Claims</strong></p>
<p>The user, on their behalf and on behalf of their heirs, family members, legal representatives, and insurers, expressly waives any right to file claims, lawsuits, legal actions, or requests for compensation against [Your Court Name] for any event related to the use of the facilities.</p>
<p><strong>Responsible Use of the Court</strong></p>
<p>The user commits to using the court responsibly and adhering to all rules and regulations established by [Your Court Name]. Failure to comply with these rules may result in immediate termination of the right to use the facilities without refund.</p>
<p><strong>Data Protection</strong></p>
<p>By registering, the user authorizes the use of their personal data solely for administrative and communication purposes related to the reservation and use of the facilities.</p>
<p><strong>Acceptance of Terms</strong></p>
<p>By proceeding with the registration or rental of the court, the user declares that they have read, understood, and accept these Terms and Conditions voluntarily and knowingly, releasing [Your Court Name] from all legal liability.</p>
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
              <span>I accept the Terms and Conditions</span>
            </label>
          </div>

        <button type="submit" className="submit-button">
          Register
        </button>
      </form>
    </div>
  );
};