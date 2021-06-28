/** @format */

const express = require("express");
const router = express.Router();
const {
  upload,
  create,
  list,
  remove,
  update,

} = require("../controllers/category");

router.post("/category/uploadImage",  upload);
router.post("/category/create", create);
router.get("/categories/list", list);
router.delete("/category/:slug", remove);
router.put("/category/:slug", update);





module.exports = router;