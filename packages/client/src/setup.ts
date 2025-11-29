export async function setupCategories() {
  const categories = [
    'Phones',
    'Laptops',
    'Accessories',
    'Components',
    'Speakers',
    'Others',
  ];

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  for (const category of categories) {
    try {
      await fetch('http://localhost:3001/api/categories', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: category }),
      });
    } catch (error) {
      console.error(`Failed to create category: ${category}`, error);
    }
  }
}
