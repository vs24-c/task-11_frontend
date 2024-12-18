class ListDataManager {
  // Создание карточки продукта
  static createProductCard(item, fields, createLinkFunction, deleteFunction) {
    let cardDiv;
    let btnBox;
    for (const key in fields) {
      cardDiv = document.createElement('div');
      cardDiv.className = 'products__card';
      const imgDiv = document.createElement('div');
      imgDiv.className = 'products__img';
      const img = document.createElement('img');
      img.src = `data:image;base64,${item.imageSrc}`;
      imgDiv.append(img);
      const ul = document.createElement('ul');

      const phoneLi = document.createElement('li');
      phoneLi.innerHTML = `Phone:<span>${item.title}</span>`;

      const priceLi = document.createElement('li');
      priceLi.innerHTML = `Price:<span>${item.price} $</span>`;

      const quantityLi = document.createElement('li');
      quantityLi.innerHTML = `Quantity:<span>${item.counter} pc</span>`;

      ul.append(phoneLi, priceLi, quantityLi);

      cardDiv.append(imgDiv, ul);
    }

    if (createLinkFunction && deleteFunction) {
      btnBox = document.createElement('div');
      btnBox.className = 'btn__box';

      const editLink = document.createElement('button');
      editLink.type = 'button';
      editLink.className = 'btn edit';
      editLink.setAttribute('data-id', createLinkFunction(item._id));
      editLink.textContent = 'Edit';

      const deleteButton = document.createElement('button');
      deleteButton.className = 'btn delete';
      deleteButton.type = 'button';
      deleteButton.setAttribute('data-id', item._id);
      deleteButton.textContent = 'Delete';

      btnBox.append(editLink, deleteButton);
      cardDiv.appendChild(btnBox);
    }

    return cardDiv;
  }

  // Создание списка продуктов
  static createProducts(data, fields, createLinkFunction, deleteFunction) {
    const productsDiv = document.createElement('div');
    productsDiv.className = 'products';

    data.forEach((item) => {
      const productCard = this.createProductCard(item, fields, createLinkFunction, deleteFunction);
      productsDiv.appendChild(productCard);
    });

    return productsDiv;
  }
  static creatSortSelect() {
// Creat form     
  const formSel = document.createElement('form')       
  formSel.action = '/products/sort'
  formSel.method = 'post'
  formSel.className = 'form'
    // Creat select
  const select = document.createElement('select')
  select.name = 'sort'
    select.className = 'products__sort'
    //Creat options in the select
    const optionNone = document.createElement('option')
    optionNone.textContent = 'Sort Price'
  const optionAsc = document.createElement('option')
    optionAsc.value = 'asc'
    optionAsc.textContent = 'Sort Ascending'
    const optionDesc = document.createElement('option')
    optionDesc.textContent = 'Sort Descending'
    optionDesc.value = 'desc'
    // Append options to select
    select.appendChild(optionNone)
    select.appendChild(optionAsc)
    select.appendChild(optionDesc)
    // Append select to form
    formSel.append(select)
    const boxTitle = document.querySelector('.products__title');
    boxTitle.appendChild(formSel)
  }
  // Генерация всей страницы
  static render() {
    const wrapper = document.querySelector('.wrapper');
    // const wrapper = this.createWrapper();
    // const title = this.createTitle();
    const products = this.createProducts();

    wrapper.append(products);
    document.body.appendChild(wrapper);
  }
}