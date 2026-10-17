import { useState, useEffect } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaImage,
  FaLink,
  FaUpload,
} from "react-icons/fa";
import api from "../../../services/api";

interface GalleryItem {
  id: number;
  title: string;
  image: string;
  category: string;
  description: string;
  created_at: string;
}

function AdminGallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    category: "Food",
    description: "",
  });
  const [imageSource, setImageSource] = useState<"link" | "upload">("link");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const categories = ["Food", "Restaurant", "Interior", "Events", "VIP", "Chef", "Dessert", "Pizza"];

  const resolveImageUrl = (url: string) =>
    url.startsWith("/uploads/") ? `http://localhost:5000${url}` : url;

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const response = await api.get("/gallery");
        setGalleryItems(response.data);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadGallery();
  }, []);

  const refreshGallery = async () => {
    try {
      const response = await api.get("/gallery");
      setGalleryItems(response.data);
    } catch (error) {
      console.error("Error refreshing gallery:", error);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ title: "", image: "", category: "Food", description: "" });
    setImageSource("link");
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      image: item.image,
      category: item.category,
      description: item.description,
    });
    setImageSource(item.image.startsWith("/uploads/") ? "upload" : "link");
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingItem(null);
    setSelectedFile(null);
    setImageSource("link");
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setFormData((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = formData.image;

      // If in upload mode with a selected file, upload it first
      if (imageSource === "upload" && selectedFile) {
        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);
        const uploadRes = await api.post("/upload", uploadFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = uploadRes.data.url;
      }

      const payload = { ...formData, image: imageUrl };

      if (editingItem) {
        await api.put(`/gallery/${editingItem.id}`, payload);
      } else {
        await api.post("/gallery", payload);
      }
      handleClose();
      await refreshGallery();
    } catch (error) {
      console.error("Error saving gallery item:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this gallery image?")) return;
    try {
      await api.delete(`/gallery/${id}`);
      await refreshGallery();
    } catch (error) {
      console.error("Error deleting gallery item:", error);
    }
  };

  const previewSrc = imageSource === "upload" && selectedFile
    ? URL.createObjectURL(selectedFile)
    : formData.image
    ? resolveImageUrl(formData.image)
    : "";

  const canSubmit = formData.title && (imageSource === "upload" ? !!selectedFile : !!formData.image);

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col md={6}>
          <h2>Gallery Management</h2>
        </Col>
        <Col md={6} className="text-end">
          <Button variant="warning" onClick={handleOpenAdd}>
            <FaPlus className="me-2" />
            Add New Image
          </Button>
        </Col>
      </Row>

      <Card className="shadow rounded-4 border-0">
        <Card.Body>
          {loading ? (
            <p className="text-center py-5">Loading gallery...</p>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-5">
              <FaImage size={60} className="text-muted mb-3" />
              <h5>No Gallery Images Yet</h5>
              <p className="text-muted">Click "Add New Image" to add your first gallery picture.</p>
            </div>
          ) : (
            <Row>
              {galleryItems.map((item) => (
                <Col lg={4} md={6} className="mb-4" key={item.id}>
                  <Card className="border-0 shadow-sm rounded-3 h-100">
                    <div style={{ height: "220px", overflow: "hidden" }}>
                      <Card.Img
                        src={resolveImageUrl(item.image)}
                        alt={item.title}
                        style={{
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h5 className="mb-1">{item.title}</h5>
                          <Badge bg="warning" text="dark">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                      {item.description && (
                        <p className="text-muted small mb-2">{item.description}</p>
                      )}
                      <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button variant="primary" size="sm" onClick={() => handleOpenEdit(item)}>
                          <FaEdit className="me-1" /> Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                          <FaTrash className="me-1" /> Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingItem ? "Edit Gallery Image" : "Add New Gallery Image"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Title *</Form.Label>
                  <Form.Control
                    placeholder="Enter image title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Category</Form.Label>
                  <Form.Select value={formData.category} onChange={(e) => handleChange("category", e.target.value)}>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Image Source Options */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Image *</Form.Label>
              <div className="d-flex gap-2 mb-3">
                <Button
                  variant={imageSource === "link" ? "warning" : "outline-secondary"}
                  onClick={() => {
                    setImageSource("link");
                    setSelectedFile(null);
                  }}
                >
                  <FaLink className="me-2" />
                  Link URL
                </Button>
                <Button
                  variant={imageSource === "upload" ? "warning" : "outline-secondary"}
                  onClick={() => {
                    setImageSource("upload");
                    setFormData((prev) => ({ ...prev, image: "" }));
                  }}
                >
                  <FaUpload className="me-2" />
                  Choose from Gallery
                </Button>
              </div>

              {imageSource === "link" ? (
                <Form.Control
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => handleChange("image", e.target.value)}
                />
              ) : (
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              )}

              {isUploading && (
                <div className="mt-2 text-warning">
                  <Spinner
                    animation="border"
                    size="sm"
                    variant="warning"
                    className="me-2"
                  />
                  Uploading image...
                </div>
              )}

              {previewSrc && !isUploading && (
                <div className="mt-2">
                  <img
                    src={previewSrc}
                    alt="Preview"
                    style={{
                      maxHeight: "150px",
                      maxWidth: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Optional description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="warning"
            onClick={handleSubmit}
            disabled={!canSubmit || isUploading}
          >
            {isUploading
              ? "Uploading..."
              : editingItem
              ? "Update"
              : "Add Image"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminGallery;