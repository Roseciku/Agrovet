const supabase = require('../config/supabaseClient');
const path = require('path');
const fs = require('fs');
const multer = require('multer');


// MULTER SETUP
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images')); // temp folder before upload
  },
  filename: (req, file, cb) => {
    const productName = req.body.name
      ? req.body.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '')
      : 'product';
    const fileName = `${Date.now()}-${productName}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

exports.upload = multer({ storage }).single('image'); // must match frontend field name

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const { data: allProducts, error } = await supabase
      .from('products')
      .select('*')
      .order('product_id', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({
        message: 'An error occurred while fetching products',
        error: error.message,
      });
    }

    return res.status(200).json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      message: 'An error occurred while fetching products',
      error: error.message,
    });
  }
};

// ADD NEW PRODUCT (ADMIN ONLY)
exports.addProduct = async (req, res) => {
  try {
    const { name, price, type, description } = req.body;
    const file = req.file;

    if (!name || !price || !file || !type || !description) {
      return res
        .status(400)
        .json({ message: 'All fields (including image) are required' });
    }

    // Upload image to Supabase Storage
    const filePath = file.path;
    const fileName = file.filename; // already unique from multer
    const bucketName = 'product-images';
    const fileStream = fs.createReadStream(filePath);

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileStream, {
        contentType: file.mimetype,
        upsert: false,
      });

    // remove local file after upload
    fs.unlink(filePath, () => {});

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return res.status(500).json({ message: 'Image upload failed' });
    }

    // Construct public URL
    const publicURL = `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucketName}/${encodeURIComponent(
      fileName
    )}`;

    // Insert product into database
    const { data: insertedProduct, error: insertError } = await supabase
      .from('products')
      .insert([{ name, price, image: publicURL, type, description }])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return res.status(500).json({
        message: 'Error adding product to database',
        error: insertError.message,
      });
    }

    return res.status(201).json(insertedProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({
      message: 'Error adding product',
      error: error.message,
    });
  }
};


// UPDATE PRODUCT (ADMIN ONLY)

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, type, description } = req.body;
    const file = req.file;

    // Get existing product
    const { data: existingProduct, error: findError } = await supabase
      .from('products')
      .select('*')
      .eq('product_id', id)
      .single();

    if (findError || !existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let image = existingProduct.image; // keep old image if none uploaded

    // If a new file is uploaded
    if (file) {
      const filePath = file.path;
      const fileName = file.filename;
      const bucketName = 'product-images';
      const fileStream = fs.createReadStream(filePath);

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, fileStream, {
          contentType: file.mimetype,
          upsert: false,
        });

      fs.unlink(filePath, () => {});

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return res.status(500).json({ message: 'Failed to upload new image' });
      }

      // Delete old image from Supabase
      if (existingProduct.image) {
        try {
          const oldKey = existingProduct.image.split('/public/product-images/')[1];
          if (oldKey) {
            await supabase.storage.from(bucketName).remove([oldKey]);
          }
        } catch (e) {
          console.warn('Failed to delete old image (might not exist):', e.message);
        }
      }

      image = `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucketName}/${encodeURIComponent(
        fileName
      )}`;
    }

    // Update product in database
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({ name, price, type, description, image })
      .eq('product_id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return res.status(500).json({
        message: 'Error updating product',
        error: updateError.message,
      });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      message: 'Error updating product',
      error: error.message,
    });
  }
};

// DELETE PRODUCT (ADMIN ONLY)

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const { data: existingProduct, error: findError } = await supabase
      .from('products')
      .select('*')
      .eq('product_id', id)
      .single();

    if (findError || !existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete image from Supabase Storage
    if (existingProduct.image) {
      try {
        const oldKey = existingProduct.image.split('/public/product-images/')[1];
        if (oldKey) {
          await supabase.storage.from('product-images').remove([oldKey]);
        }
      } catch (e) {
        console.warn('Failed to delete image from storage:', e.message);
      }
    }

    // Delete product from DB
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('product_id', id);

    if (deleteError) {
      console.error('Error deleting product:', deleteError);
      return res.status(500).json({
        message: 'Error deleting product',
        error: deleteError.message,
      });
    }

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      message: 'Error deleting product',
      error: error.message,
    });
  }
};
