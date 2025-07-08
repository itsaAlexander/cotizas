
let totalCost = 0;

    function updateDate() {
        const dateElement = document.getElementById('date');
        const now = new Date();
        dateElement.textContent = now.toLocaleDateString('ru-RU');
    }

    setInterval(updateDate, 1000);

    function addProduct() {
    const productSelect = document.getElementById('productSelect');
    const quantityInput = document.getElementById('quantity');
    const invoiceBody = document.getElementById('invoiceBody');

    const price = parseFloat(productSelect.value);
    const productName = productSelect.options[productSelect.selectedIndex].dataset.name;
    const quantity = parseInt(quantityInput.value);

    const total = price * quantity;
    totalCost += total;

    const row = document.createElement('tr');
    row.setAttribute('data-unsaved', 'false'); // Новая строка помечается как сохраненная
    row.innerHTML =  `
        <td class="product-cell">${productName}</td>
        <td class="price-cell">$${price.toFixed(2)}</td>
        <td class="quantity-cell">${quantity}</td>
        <td class="total-cell">$${total.toFixed(2)}</td>
        <td class="remove-column">
            <button onclick="editProduct(this)">Editar</button>
            <button onclick="removeProduct(this)">Eliminar</button>
        </td>
    `;
    invoiceBody.appendChild(row);

    updateTotalCost();
}
function editProduct(button) {
    const row = button.closest('tr');
    const productCell = row.querySelector('.product-cell');
    const priceCell = row.querySelector('.price-cell');
    const quantityCell = row.querySelector('.quantity-cell');

    if (button.textContent === 'Editar') {
        // Переключаем ячейки в режим редактирования
        productCell.contentEditable = 'true';
        priceCell.contentEditable = 'true';
        quantityCell.contentEditable = 'true';

        button.textContent = 'Guardar';
        row.setAttribute('data-unsaved', 'true');
    } else {
        // Сохраняем изменения
        const newProduct = productCell.textContent;
        const newPrice = parseFloat(priceCell.textContent.replace('$', ''));
        const newQuantity = parseInt(quantityCell.textContent);
       

        if (!isNaN(newPrice) && !isNaN(newQuantity)) {
            const newTotal = newPrice * newQuantity;
            totalCost -= parseFloat(row.querySelector('.total-cell').textContent.replace('$', ''));
            totalCost += newTotal;

            row.querySelector('.total-cell').textContent = `$${newTotal.toFixed(2)}`;

            // Обновляем режим отображения
            productCell.contentEditable = 'false';
            priceCell.contentEditable = 'false';
            quantityCell.contentEditable = 'false';
           

            button.textContent = 'Editar';
            row.setAttribute('data-unsaved', 'false'); 
            

            updateTotalCost();
        } else {
            alert('Пожалуйста, введите корректные значения.');
        }
    }
}

    function removeProduct(button) {
        const total = parseFloat(button.closest('tr').children[3].textContent.replace('$', ''));
        totalCost -= total;
        const row = button.closest('tr');
        row.remove();
        updateTotalCost();
    }

    function updateTotalCost() {
        const iva = totalCost * 1; // 16% IVA
        const totalFinal = totalCost + iva;

        document.getElementById('totalCost').textContent = `Subtotal: $${totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        document.getElementById('ivaCost').textContent = `IVA: $${iva.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        document.getElementById('totalFinalCost').textContent = `Total: $${totalFinal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        document.getElementById('totalCostWords').textContent = ` ${numberToWords(totalFinal)}`;
    }
    window.onload = function() {
    document.getElementById('currentDateTime').textContent = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
};

function numberToWords(number) {
    number = Math.round(number * 100) / 100; // Округление до двух знаков

    if (number === 0) return "cero";

    const units = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
    const teens = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
    const tens = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
    const hundreds = ["", "cien", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

    function convertTriplet(num, isThousandOrMore) {
        const h = Math.floor(num / 100);
        const t = Math.floor((num % 100) / 10);
        const u = num % 10;

        let words = h === 1 && t + u > 0 ? "ciento" : hundreds[h];

        if (t === 1 && u > 0) {
            words += " " + teens[u];
        } else if (t === 2 && u > 0) {
            words += " veinti" + units[u];
        } else {
            words += " " + tens[t];
            if (u > 0) {
                const unitWord = u === 1 ? (isThousandOrMore ? "un" : "uno") : units[u];
                words += (t > 2 ? " y " : "") + unitWord;
            }
        }
        return words.trim();
    }

    const integerPart = Math.floor(number);
    const decimalPart = Math.round((number % 1) * 100);

    let words = "";
    const billionsPart = Math.floor(integerPart / 1000000000);
    const millionsPart = Math.floor((integerPart % 1000000000) / 1000000);
    const thousandsPart = Math.floor((integerPart % 1000000) / 1000);
    const rest = integerPart % 1000;

    if (billionsPart > 0) {
        words += convertTriplet(billionsPart, true) + " " + (billionsPart > 1 ? "millones" : "millón") + " ";
    }

    if (millionsPart > 0) {
        words += convertTriplet(millionsPart, true) + " millones ";
    }

    // Исправление для чисел от 10,000 до 10,999
    if (thousandsPart === 10 && integerPart < 11000) {
        words += "diez mil ";
    } else if (thousandsPart > 0) {
        if (thousandsPart === 1 && millionsPart === 0) {
            words += "mil ";
        } else {
            words += convertTriplet(thousandsPart, true) + " mil ";
        }
    }

    if (rest > 0) {
        words += convertTriplet(rest, false);
    }

    // Добавление дробной части
    if (decimalPart > 0) {
        words += ` pesos ${decimalPart} / 100`;
    }

    return words.trim();
}




    function printPage() {
        const unsavedRows = document.querySelectorAll('tr[data-unsaved="true"]');
        if (unsavedRows.length > 0) {
            alert("Los cambios no se han guardado.");
        } else {
            window.print();
        }
    }

    updateDate();
    
