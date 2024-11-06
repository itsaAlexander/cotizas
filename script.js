
let totalCost = 0;
let unsavedChanges = false; // флаг несохраненных изменений

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
    row.innerHTML = `
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
        unsavedChanges = true;

        button.textContent = 'Guardar';
        
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
            unsavedChanges = false;

            button.textContent = 'Editar';
            

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
        const iva = totalCost * 0.16; // 16% IVA
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
        if (number === 0) return "cero";

        const units = ["", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
        const teens = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
        const tens = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
        const hundreds = ["", "cien", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];
        const thousands = ["mil"];
        const millions = ["millón", "millones"];
        const billions = ["mil millones"];

        function convertTriplet(num) {
            const h = Math.floor(num / 100);
            const t = Math.floor((num % 100) / 10);
            const u = num % 10;

            let words = hundreds[h] + " ";
            if (t === 1 && u > 0) {
                words += teens[u] + " ";
            } else {
                words += tens[t] + " " + units[u] + " ";
            }
            return words.trim();
        }

        let words = "";
        const billionsPart = Math.floor(number / 1000000000);
        const millionsPart = Math.floor((number % 1000000000) / 1000000);
        const thousandsPart = Math.floor((number % 1000000) / 1000);
        const unitsPart = Math.floor(number % 1000);

        if (billionsPart > 0) words += convertTriplet(billionsPart) + " " + (billionsPart > 1 ? billions[1] : billions[0]) + " ";
        if (millionsPart > 0) words += convertTriplet(millionsPart) + " " + (millionsPart > 1 ? millions[1] : millions[0]) + " ";
        if (thousandsPart > 0) words += convertTriplet(thousandsPart) + " " + thousands[0] + " ";
        words += convertTriplet(unitsPart);

        // Разделение целой части и десятичной
        const decimalPart = (number % 1).toFixed(2).split('.')[1];
        if (decimalPart > 0) {
            words += ` pesos ${decimalPart} / 100`; // Указываем десятичные знаки
        }

        return words.trim();
    }
    

    function printPage() {
        if (unsavedChanges) {
            alert("Los cambios no se han guardado");
        } else {
            window.print();
        }
    }

    updateDate();

