describe("Módulo de Reportes - ERP Vallegrande", () => {

  beforeEach(() => {
    cy.visit("http://localhost:3000/reportes.html");

    // Esperar que los clientes estén cargados
    cy.get("#fCliente option").should("have.length.greaterThan", 1);
  });

  it("Consultar reportes por fecha y cliente", () => {
    // Seleccionar fechas
    const hoy = new Date();
    const inicio = new Date();
    inicio.setDate(hoy.getDate() - 7); // 7 días atrás

    const formato = (date) => date.toISOString().split("T")[0];

    cy.get("#fInicio").type(formato(inicio));
    cy.get("#fFin").type(formato(hoy));

    // Seleccionar primer cliente
    cy.get("#fCliente").select(1);

    // Espiar la petición fetch de reportes
    cy.intercept("GET", /\/api\/reportes.*/).as("getReportes");

    // Hacer click en buscar
    cy.get("#btnBuscar").click();

    // Esperar y validar que la API fue llamada
    cy.wait("@getReportes").its("response.statusCode").should("eq", 200);

    // Verificar que la tabla se llenó
    cy.get("#tbodyReportes tr").should("have.length.greaterThan", 0);

    // Verificar que los gráficos se renderizaron (Chart.js agrega canvas con data)
    cy.get("#graficoVentas").should(($canvas) => {
      expect($canvas[0].getContext("2d")).to.exist;
    });

    cy.get("#graficoProductos").should(($canvas) => {
      expect($canvas[0].getContext("2d")).to.exist;
    });
  });

  it("Exportar reporte a PDF y Excel", () => {
    // Espiar POST para PDF
    cy.intercept("POST", "/api/reportes/pdf").as("exportPDF");
    cy.get("#btnPDF").click();
    cy.wait("@exportPDF").its("response.statusCode").should("eq", 200);

    // Espiar POST para Excel
    cy.intercept("POST", "/api/reportes/excel").as("exportExcel");
    cy.get("#btnExcel").click();
    cy.wait("@exportExcel").its("response.statusCode").should("eq", 200);
  });

});
