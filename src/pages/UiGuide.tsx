export default function UiGuide() {
  return (
    <div className="p-6 space-y-10 max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        UI Guide — Anzaval
      </h1>

      {/* ===================== CARDS ===================== */}
      <section className="space-y-4">
        <h2 className="section-title">Cards</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-base">
            <h3 className="section-title">Card base</h3>
            <p className="text-secondary">
              Contenedor estándar para secciones, fichas técnicas y bloques.
            </p>
          </div>

          <div className="section-base">
            <h3 className="section-header">Section base</h3>
            <p className="text-secondary">
              Variante de card con espaciado interno predefinido.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== INPUTS ===================== */}
      <section className="space-y-4">
        <h2 className="section-title">Inputs & Selects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input-base"
            placeholder="Input base"
          />

          <select className="select-base">
            <option>Opción 1</option>
            <option>Opción 2</option>
          </select>

          <textarea
            className="textarea-base"
            placeholder="Textarea base"
          />
        </div>
      </section>

      {/* ===================== BOTONES ===================== */}
      <section className="space-y-4">
        <h2 className="section-title">Botones</h2>

        <div className="flex flex-wrap gap-3">
          <button className="btn-primary">Primario</button>
          <button className="btn-secondary">Secundario</button>
          <button className="btn-danger">Peligro</button>
        </div>
      </section>

      {/* ===================== TABS ===================== */}
      <section className="space-y-4">
        <h2 className="section-title">Tabs</h2>

        <div className="flex gap-2 flex-wrap">
          <button className="tab-base tab-active">Activo</button>
          <button className="tab-base tab-inactive">Inactivo</button>
        </div>
      </section>

      {/* ===================== CHIPS ===================== */}
      <section className="space-y-4">
        <h2 className="section-title">Chips</h2>

        <div className="flex gap-2 flex-wrap">
          <span className="chip-base">Default</span>
          <span className="chip-base chip-blue">Blue</span>
          <span className="chip-base chip-green">Green</span>
          <span className="chip-base chip-red">Red</span>
        </div>
      </section>

      {/* ===================== FIELD ROW ===================== */}
      <section className="space-y-4">
        <h2 className="section-title">FieldRow</h2>

        <div className="card-base space-y-2">
          <div className="field-row">
            <span className="field-label">Ubicación</span>
            <span className="field-value">Planta 1</span>
          </div>
          <div className="field-row">
            <span className="field-label">Piso</span>
            <span className="field-value">2</span>
          </div>
        </div>
      </section>

      {/* ===================== MOBILE CARD ===================== */}
      <section className="space-y-4">
        <h2 className="section-title">Mobile Card</h2>

        <div className="mobile-card-base max-w-sm">
          <h3 className="mobile-card-title">Producto ejemplo</h3>
          <p className="mobile-card-text">Tag: ANZ-001</p>
          <p className="mobile-card-extra">Ubicación: Almacén</p>
        </div>
      </section>

      {/* ===================== WIZARD ===================== */}
      <section className="space-y-4">
        <h2 className="section-title">Wizard (header / footer)</h2>

        <div className="card-base p-0 overflow-hidden">
          <div className="wizard-header">
            <h3 className="wizard-title">Datos del activo</h3>
          </div>

          <div className="p-4 text-secondary">
            Contenido del wizard…
          </div>

          <div className="wizard-footer flex gap-3">
            <button className="btn-secondary">Anterior</button>
            <button className="btn-primary">Siguiente</button>
          </div>
        </div>
      </section>

    </div>
  );
}
