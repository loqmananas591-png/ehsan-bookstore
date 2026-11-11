
"use strict";

const WHATSAPP_NUMBER = "93700018312";
const BOOKS_STORAGE_KEY = "ehsan_books";
const CART_STORAGE_KEY = "ehsan_cart";

const onlineBookImages = {
    quran: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=700&q=85",
    seerah: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=700&q=85",
    ethics: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=700&q=85",
    general: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=85"
};

const categories = [
    { name: "عقاید", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=85" },
    { name: "علوم قرآنی", image: onlineBookImages.quran },
    { name: "حدیث و سنت", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=700&q=85" },
    { name: "فقه و اصول", image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=700&q=85" },
    { name: "تزکیه و اخلاق اسلامی", image: onlineBookImages.ethics },
    { name: "سیره", image: onlineBookImages.seerah },
    { name: "تاریخی", image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=700&q=85" },
    { name: "ادبی", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=700&q=85" },
    { name: "فکر و اندیشه", image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=700&q=85" },
    { name: "خانواده و بانوان", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=700&q=85" },
    { name: "کودکان و نوجوانان", image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=700&q=85" },
    { name: "روان‌شناسی", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=85" },
    { name: "ادعیه و اذکار", image: onlineBookImages.quran },
    { name: "دعوت و دعوت‌گری", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=700&q=85" },
    { name: "طب و سلامت", image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=700&q=85" },
    { name: "محصولات جانبی", image: onlineBookImages.general }
];

const defaultBooks = [
    {
        id: 1,
        title: "قرآن کریم",
        author: "کلام الله مجید",
        category: "علوم قرآنی",
        price: 250,
        image: onlineBookImages.quran,
        badge: "پیشنهادی"
    },
    {
        id: 2,
        title: "فقه السیره",
        author: "محمد غزالی",
        category: "سیره",
        price: 350,
        image: onlineBookImages.seerah,
        badge: "جدید"
    },
    {
        id: 3,
        title: "احیاء علوم الدین",
        author: "امام غزالی",
        category: "تزکیه و اخلاق اسلامی",
        price: 600,
        image: onlineBookImages.ethics,
        badge: "پرفروش"
    }
];

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function formatPrice(price) {
    return Number(price || 0).toLocaleString("fa-AF") + " افغانی";
}

function readStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        console.error("خطا در خواندن حافظه مرورگر:", error);
        return fallback;
    }
}

function getBooks() {
    const savedBooks = readStorage(BOOKS_STORAGE_KEY, null);

    if (Array.isArray(savedBooks) && savedBooks.length > 0) {
        return savedBooks.map((book, index) => ({
            ...book,
            id: book.id ?? index + 1,
            title: book.title || "کتاب بدون نام",
            author: book.author || "نویسنده نامشخص",
            category: book.category || "گوناگون",
            price: Number(book.price || 0),
            image: book.image || "",
            badge: book.badge || ""
        }));
    }

    return defaultBooks;
}

let books = getBooks();

let cart = readStorage(CART_STORAGE_KEY, []);

if (!Array.isArray(cart)) {
    cart = [];
}

function saveCart() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
        alert("ذخیره سبد خرید امکان‌پذیر نیست.");
        console.error(error);
    }
}

function imageForBook(book) {
    if (book.image) return book.image;

    const category = String(book.category || "");

    if (category.includes("قرآن") || category.includes("اذکار")) {
        return onlineBookImages.quran;
    }

    if (category.includes("سیره") || category.includes("تاریخ")) {
        return onlineBookImages.seerah;
    }

    if (category.includes("اخلاق") || category.includes("تزکیه")) {
        return onlineBookImages.ethics;
    }

    return onlineBookImages.general;
}

/* نمایش دسته‌بندی‌ها */

function renderCategories() {
    const grid = document.getElementById("categoryGrid");

    if (!grid) return;

    grid.innerHTML = categories.map(category => `
        <button
            type="button"
            class="category-card"
            style="
                --category-image: url('${escapeHTML(category.image)}');
                background-image:
                    linear-gradient(to top, rgba(10, 40, 28, .88), rgba(10, 40, 28, .12)),
                    url('${escapeHTML(category.image)}');
            "
            onclick="filterCategory('${escapeHTML(category.name)}')"
        >
            <span>${escapeHTML(category.name)}</span>
        </button>
    `).join("");
}

/* سبد خرید */

function addToCart(bookId) {
    const book = books.find(item => String(item.id) === String(bookId));

    if (!book) {
        alert("این کتاب پیدا نشد.");
        return;
    }

    const existing = cart.find(item => String(item.id) === String(book.id));

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: book.id,
            title: book.title,
            price: Number(book.price),
            quantity: 1
        });
    }

    saveCart();
    updateCart();

    alert("کتاب با موفقیت به سبد خرید اضافه شد.");
}

function removeFromCart(bookId) {
    cart = cart.filter(item => String(item.id) !== String(bookId));

    saveCart();
    updateCart();
}

function changeQuantity(bookId, amount) {
    const item = cart.find(item => String(item.id) === String(bookId));

    if (!item) return;

    item.quantity = Number(item.quantity || 0) + amount;

    if (item.quantity <= 0) {
        removeFromCart(bookId);
        return;
    }

    saveCart();
    updateCart();
}

function updateCart() {
    const count = cart.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
    );

    const total = cart.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
    );

    document.querySelectorAll("#cartCount, .cart-count").forEach(element => {
        element.textContent = count;
    });

    const totalElement = document.getElementById("cartTotal");

    if (totalElement) {
        totalElement.textContent = "مجموع: " + formatPrice(total);
    }

    const cartItems = document.getElementById("cartItems");

    if (!cartItems) return;

    if (!cart.length) {
        cartItems.innerHTML = '<p class="empty-cart">سبد خرید شما خالی است.</p>';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <strong>${escapeHTML(item.title)}</strong>
                <p>${formatPrice(item.price)} × ${Number(item.quantity)}</p>
                <strong>${formatPrice(Number(item.price) * Number(item.quantity))}</strong>
            </div>

            <div class="cart-actions">
                <button type="button" onclick="changeQuantity('${escapeHTML(item.id)}', 1)">+</button>
                <span>${Number(item.quantity)}</span>
                <button type="button" onclick="changeQuantity('${escapeHTML(item.id)}', -1)">−</button>
                <button class="remove-cart" type="button" onclick="removeFromCart('${escapeHTML(item.id)}')">حذف</button>
            </div>
        </div>
    `).join("");
}

/* کارت کتاب */

function createBookCard(book) {
    const image = imageForBook(book);

    return `
        <article class="book-card">

            <div class="book-image-wrap">
                <img
                    src="${escapeHTML(image)}"
                    alt="تصویر ${escapeHTML(book.title)}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='${onlineBookImages.general}'"
                >

                ${book.badge
                    ? `<span class="book-badge">${escapeHTML(book.badge)}</span>`
                    : ""
                }
            </div>

            <div class="book-details">

                <span class="book-category">
                    ${escapeHTML(book.category)}
                </span>

                <h3>${escapeHTML(book.title)}</h3>

                <p class="book-author">
                    نویسنده: ${escapeHTML(book.author)}
                </p>

                <strong class="price">
                    ${formatPrice(book.price)}
                </strong>

                <div class="book-buttons">

                    <button
                        class="add-cart-button"
                        type="button"
                        onclick="addToCart('${escapeHTML(book.id)}')"
                    >
                        افزودن به سبد
                    </button>

                    <button
                        class="whatsapp-order-button"
                        type="button"
                        onclick="orderSingleBook('${escapeHTML(book.id)}')"
                    >
                        سفارش در واتساپ
                    </button>

                </div>
            </div>
        </article>
    `;
}

/* نمایش کتاب‌ها */

function renderBooks() {
    books = getBooks();

    const newGrid = document.getElementById("newBooksGrid");
    const bestGrid = document.getElementById("bestBooksGrid");

    if (newGrid) {
        const latest = books.slice().reverse();

        newGrid.innerHTML = latest.length
            ? latest.map(createBookCard).join("")
            : '<p class="no-results">هنوز کتابی ثبت نشده است.</p>';
    }

    if (bestGrid) {
        const best = books.filter(book =>
            String(book.badge || "").includes("پرفروش")
        );

        const selected = best.length ? best : books.slice(0, 4);

        bestGrid.innerHTML = selected.length
            ? selected.map(createBookCard).join("")
            : '<p class="no-results">هنوز کتابی ثبت نشده است.</p>';
    }
}

/* جستجو و فیلتر */

function showSearchResults(results) {
    const container = document.getElementById("newBooksGrid");

    if (!container) return;

    container.innerHTML = results.length
        ? results.map(createBookCard).join("")
        : '<p class="no-results">کتابی با این مشخصات پیدا نشد.</p>';

    document.getElementById("new-books")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function searchBooks() {
    const input = document.getElementById("searchInput");

    if (!input) return;

    const query = input.value.trim().toLocaleLowerCase();

    if (!query) {
        renderBooks();
        return;
    }

    const results = books.filter(book =>
        [book.title, book.author, book.category].some(value =>
            String(value || "").toLocaleLowerCase().includes(query)
        )
    );

    showSearchResults(results);
}

function filterCategory(category) {
    const results = books.filter(book =>
        String(book.category || "").trim() === String(category).trim()
    );

    showSearchResults(results);
}

/* سفارش مستقیم یک کتاب */

function orderSingleBook(bookId) {
    const book = books.find(item => String(item.id) === String(bookId));

    if (!book) {
        alert("کتاب پیدا نشد.");
        return;
    }

    const message =
        "سلام، از کتاب احسان کابل می‌خواهم کتاب زیر را سفارش بدهم:\n\n" +
        "نام کتاب: " + book.title +
        "\nنویسنده: " + book.author +
        "\nقیمت: " + formatPrice(book.price) +
        "\n\nلطفاً برای تکمیل سفارش راهنمایی کنید.";

    window.open(
        "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message),
        "_blank"
    );
}

/* سفارش تمام سبد خرید */

function checkoutWhatsApp() {
    if (!cart.length) {
        alert("سبد خرید شما خالی است.");
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
    );

    let message = "سلام، می‌خواهم از کتاب احسان کابل سفارش ثبت کنم.\n\n";

    cart.forEach((item, index) => {
        message +=
            (index + 1) + ". " + item.title +
            "\nتعداد: " + item.quantity +
            "\nقیمت: " + formatPrice(item.price * item.quantity) +
            "\n\n";
    });

    message +=
        "مجموع سفارش: " + formatPrice(total) +
        "\n\nلطفاً برای تکمیل سفارش با من تماس بگیرید.";

    window.open(
        "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message),
        "_blank"
    );
}

/* پنجره‌های فروشگاه */

function openCart() {
    updateCart();
    document.getElementById("cartModal")?.classList.add("show");
}

function closeCart() {
    document.getElementById("cartModal")?.classList.remove("show");
}

function openAccount() {
    document.getElementById("accountModal")?.classList.add("show");
}

function closeAccount() {
    document.getElementById("accountModal")?.classList.remove("show");
}

/* منوی موبایل */

function toggleMenu() {
    document.getElementById("navMenu")?.classList.toggle("open");
}

/* شروع برنامه */

document.addEventListener("DOMContentLoaded", () => {

    renderCategories();
    renderBooks();
    updateCart();

    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                searchBooks();
            }
        });
    }

    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", event => {
            if (event.target === modal) {
                modal.classList.remove("show");
            }
        });
    });

    document.querySelectorAll("#navMenu a").forEach(link => {
        link.addEventListener("click", () => {
            document.getElementById("navMenu")?.classList.remove("open");
        });
    });

});

/* همگام‌سازی تغییرات در تب‌های دیگر همین مرورگر */

window.addEventListener("storage", event => {
    if (event.key === BOOKS_STORAGE_KEY) {
        renderBooks();
    }

    if (event.key === CART_STORAGE_KEY) {
        cart = readStorage(CART_STORAGE_KEY, []);
        if (!Array.isArray(cart)) cart = [];
        updateCart();
    }
});
