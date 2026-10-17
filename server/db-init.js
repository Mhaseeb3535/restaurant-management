import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  password: "mhrajp35",
  host: "localhost",
  port: 5432,
  database: "restaurant",
});

const initDB = async () => {
  try {
    console.log("Initializing database...");

    // Create tables
    await pool.query(`
      -- Users table (for all roles)
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff', 'superadmin')),
        status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'On Leave')),
        avatar VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Staff table
      CREATE TABLE IF NOT EXISTS staff (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        role VARCHAR(100) NOT NULL,
        shift VARCHAR(50) DEFAULT 'Morning' CHECK (shift IN ('Morning', 'Evening', 'Night')),
        salary DECIMAL(10,2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'On Leave')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Menu items table
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        rating DECIMAL(2,1) DEFAULT 0,
        available BOOLEAN DEFAULT true,
        special BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

-- Orders table
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        customer_name VARCHAR(255) NOT NULL,
        items JSONB NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Preparing', 'Ready', 'Delivered', 'Cancelled', 'Rejected', 'Refund Requested', 'Refunded')),
        payment_method VARCHAR(50) DEFAULT 'cod' CHECK (payment_method IN ('online', 'card', 'cod')),
        payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
        delivery_address TEXT,
        special_instructions TEXT,
        screenshot VARCHAR(500),
        refund_reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Reservations table
      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        date DATE NOT NULL,
        time TIME NOT NULL,
        guests INTEGER NOT NULL,
        dining_area VARCHAR(100),
        occasion VARCHAR(255),
        special_request TEXT,
        status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected')),
        admin_message TEXT,
        available_capacity INTEGER,
        alternative_date DATE,
        alternative_time TIME,
        reviewed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Customers table (for admin customer management)
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        orders INTEGER DEFAULT 0,
        total_spent DECIMAL(10,2) DEFAULT 0,
        join_date DATE DEFAULT CURRENT_DATE,
        status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Transactions table (for finance)
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense')),
        date DATE DEFAULT CURRENT_DATE,
        status VARCHAR(50) DEFAULT 'Completed' CHECK (status IN ('Completed', 'Pending')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Settings table
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE NOT NULL,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Gallery table
      CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image VARCHAR(500) NOT NULL,
        category VARCHAR(100) DEFAULT 'Food',
        description TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Contact Messages table
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) DEFAULT '',
        subject VARCHAR(255) DEFAULT '',
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Notifications table
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        category VARCHAR(50) DEFAULT 'general',
        link VARCHAR(255) DEFAULT '/customer',
        is_read BOOLEAN DEFAULT false,
        event_key VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Password Resets table
      CREATE TABLE IF NOT EXISTS password_resets (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        code VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("All tables created successfully!");

    // Seed default data
    const userCount = await pool.query("SELECT COUNT(*) FROM users");
    if (parseInt(userCount.rows[0].count) === 0) {
      console.log("Seeding default data...");

      // Import bcrypt synchronously
      const bcrypt = (await import("bcryptjs")).default;
      const hashedPassword = await bcrypt.hash("1234", 10);

      // Create default users
      await pool.query(`
        INSERT INTO users (name, email, password, role, status) VALUES
        ('Admin User', 'admin@diego.com', $1, 'admin', 'Active'),
        ('Staff User', 'staff@diego.com', $1, 'staff', 'Active'),
        ('Super Admin', 'superadmin@diego.com', $1, 'superadmin', 'Active'),
        ('John Customer', 'john@email.com', $1, 'customer', 'Active')
      `, [hashedPassword]);

      // Insert default staff
      await pool.query(`
        INSERT INTO staff (name, email, phone, role, shift, salary, status) VALUES
        ('Ali Khan', 'ali@royal.com', '0300-1111111', 'Head Chef', 'Morning', 2500, 'Active'),
        ('Ahmed Raza', 'ahmed@royal.com', '0300-2222222', 'Waiter', 'Evening', 1200, 'Active'),
        ('Sara Ali', 'sara@royal.com', '0300-3333333', 'Cashier', 'Morning', 1400, 'Active'),
        ('Usman Khan', 'usman@royal.com', '0300-4444444', 'Chef', 'Night', 1800, 'Active')
      `);

      // Insert default menu items
      await pool.query(`
        INSERT INTO menu_items (name, category, price, description, image, rating, available, special) VALUES
        ('Chicken Biryani', 'Main Course', 12.00, 'Fragrant basmati rice with tender chicken and aromatic spices', 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=600', 4.8, true, true),
        ('Pepperoni Pizza', 'Pizza', 18.00, 'Classic pepperoni pizza with mozzarella cheese', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600', 4.7, true, false),
        ('Beef Burger', 'Fast Food', 10.00, 'Juicy beef patty with fresh lettuce and special sauce', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600', 4.6, true, false),
        ('Chicken Karahi', 'Pakistani', 20.00, 'Traditional chicken karahi with fresh tomatoes and ginger', 'https://images.unsplash.com/photo-1604908176997-431f84a8b7e2?w=600', 4.9, true, true),
        ('Pasta Alfredo', 'Italian', 15.00, 'Creamy alfredo pasta with parmesan cheese', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600', 4.5, false, false),
        ('Chocolate Cake', 'Dessert', 8.00, 'Rich chocolate cake with ganache topping', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600', 4.9, true, false)
      `);

      // Insert default transactions
      await pool.query(`
        INSERT INTO transactions (description, category, amount, type, date, status) VALUES
        ('Order Payments (24 orders)', 'Sales', 1850, 'income', CURRENT_DATE, 'Completed'),
        ('Vegetable Supply', 'Inventory', 450, 'expense', CURRENT_DATE, 'Completed'),
        ('Staff Salaries', 'Payroll', 3200, 'expense', CURRENT_DATE, 'Completed'),
        ('Online Order Revenue', 'Sales', 980, 'income', CURRENT_DATE, 'Completed')
      `);

      console.log("Default data seeded successfully!");
    }

    console.log("Database initialization complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
};

initDB();
