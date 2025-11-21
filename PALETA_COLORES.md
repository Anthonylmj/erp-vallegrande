# 🎨 Paleta de Colores - ERP Vallegrande

## Estructura de Colores Institucionales

### Colores Principales

| Color | Código Hex | Nombre | Uso |
|-------|-----------|--------|-----|
| Verde Institucional | `#7d8b4d` | Verde Oliva | Botones, headers, acentos principales |
| Gris Oscuro | `#333` | Gris Oscuro | Texto principal, títulos |
| Gris Claro | `#777` | Gris Claro | Texto secundario, pie de página |
| Fondo Crema | `#f5f3eb` | Beige/Crema | Fondo general de página |

---

## Colores Complementarios

### Navbar y Sidebar
| Color | Código Hex | Elemento |
|-------|-----------|----------|
| Navbar | `#f0ead2` | Barra de navegación superior |
| Sidebar | `#e4e0cc` | Menú lateral |

### Estados y Variaciones
| Color | Código Hex | Estado |
|-------|-----------|--------|
| Verde Oscuro (Hover) | `#6f7c45` | Hover en botones verde |
| Verde Grisáceo (Activo) | `#a3b18a` | Elementos activos, gráficos |
| Blanco | `#fff` / `#ffffff` | Texto sobre fondo oscuro |

### Colores Bootstrap Integrados
| Color | Uso |
|-------|-----|
| `text-success` | Mensajes de éxito (verde) |
| `text-danger` | Mensajes de error (rojo) |
| `text-warning` | Alertas (amarillo/naranja) |
| `text-primary` | Información (azul) |
| `text-secondary` | Texto secundario (gris) |

---

## Paleta Completa en Código

### JavaScript (PDF y Backend)
```javascript
// 🎨 Colores institucionales
const colores = {
  verde: '#7d8b4d',
  gris: '#333',
  grisClaro: '#777',
  fondo: '#f5f3eb'
};
```

### CSS (Estilos HTML/Frontend)
```css
/* Colores principales */
--color-verde: #7d8b4d;
--color-gris-oscuro: #333;
--color-gris-claro: #777;
--color-fondo: #f5f3eb;

/* Sidebar y Navbar */
--color-navbar: #f0ead2;
--color-sidebar: #e4e0cc;

/* Elementos destacados */
--color-verde-oscuro: #6f7c45;    /* Hover */
--color-gris-button: #5a5a2c;     /* Toggle menu */
```

---

## Aplicación en Diferentes Elementos

### 🟢 Verde Institucional (#7d8b4d)
- Headers de tabla
- Botones principales (`.btn-olive`)
- Links activos en sidebar
- Líneas divisorias en PDFs
- Bordes de cajas
- Texto de títulos

### ⚪ Blanco (#fff)
- Texto sobre fondo verde
- Fondos de tarjetas
- Contenido principal

### 🟤 Beige/Crema (#f5f3eb)
- Fondo general de todas las páginas
- Color de referencia de la marca

### 🟫 Grises (#333, #777)
- Texto principal: `#333`
- Texto secundario/débil: `#777`

### 🟡 Navbar (#f0ead2) y Sidebar (#e4e0cc)
- Barra de navegación superior
- Menú lateral colapsable

---

## Jerarquía Visual

```
Primario:    Verde Institucional (#7d8b4d) ← Usa este color para elementos importantes
Secundario:  Grises (#333, #777) ← Usa para texto y elementos de menos importancia
Fondo:       Crema (#f5f3eb) ← Base neutra
Neutral:     Blanco (#fff) ← Contenedores y espacios
```

---

## Archivos donde se utiliza

### Backend/PDF
- `routes/pdf.js` - Colores en generación de documentos PDF
- `routes/pdfRemisiones.js` - Colores en remisiones

### Frontend HTML
- `frontend/index.html` - Dashboard
- `frontend/productos.html` - Gestión de inventario
- `frontend/clientes.html` - Gestión de clientes
- `frontend/remisiones.html` - Módulo de remisiones

---

## Notas de Diseño

✅ **Consistencia**: Los mismos colores se repiten en toda la aplicación  
✅ **Accesibilidad**: Contraste suficiente entre texto y fondo  
✅ **Marca**: Verde oliva como color institucional diferenciador  
✅ **Neutralidad**: Grises y beige mantienen un diseño profesional  

