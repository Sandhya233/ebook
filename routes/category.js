const express = require("express");
const router = new express.Router();
const Category = require("../models/category");
router.post('/category', async (req, res) => {
    const category = new Category({
        title: req.body.title,
        description:req.body.description
    })
    try {
        await category.save()
        res.status(201).json({ status: "success", data: { posts: category } });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "error",
            message: " error occured please try again",
        })
    }
})
router.get("/categories", async (req, res) => {
    try {
      const category = await Category.find({});
      res.json({ status: "success", data: { posts: category } });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Server error",
      });
    }
});
router.get('/categories/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
      res.json({ status: "success", data: { posts: category } });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Server error",
      });
    }
  });
router.put('/category/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      description:req.body.description,
    }, {
      new: true,
    });
  res.json({ status: "success", data: { posts: category } });
  } catch (error) {
    console.log("error")
  res.status(400).json({
    status: "error",
    message: "Server error",
  });
}
})
router.delete('/category/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
   
    return res.json({
      status: "success",
      data: { post: category },
      messsage: "deleted successfully ",
    });
  }
  catch (error) {
    console.log(error);
    res.status(400).json({ status: "error", message: "Server error" });
  }
})
module.exports = router;