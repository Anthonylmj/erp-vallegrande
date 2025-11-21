describe("Módulo de Remisiones - Vallegrande ERP", () => {

  it("Crear nueva remisión correctamente", () => {

    cy.visit("http://localhost:3000/remisiones.html");

    // Esperar a que los productos estén cargados
    cy.get("#tablaProductos tbody tr").should("have.length.greaterThan", 0);

    // Seleccionar cliente
    cy.get("#selectCliente").select(1);

    // Seleccionar primer producto y cantidad
    cy.get("#tablaProductos tbody tr").first().within(() => {
      cy.get('input[type="checkbox"]').check({ force: true });
      cy.get('input[type="number"]').clear().type("3");
    });

    // Hacer submit del form directamente
    cy.get("#formRemision").submit();

    // Verificar mensaje de éxito
    cy.get("#mensaje", { timeout: 10000 }).should("contain.text", "✅");

    // Opcional: verificar que la tabla de remisiones se actualizó
    cy.get("#tablaRemisiones tbody tr").should("have.length.greaterThan", 0);
  });

});
