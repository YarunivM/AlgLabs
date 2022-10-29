const CONSTANTS = {
  RED: "RED",
  BLACK: "BLACK",
};

class Node {
  constructor(param) {
    this.key = param.key || 0;
    this.color = param.color || CONSTANTS.RED;
    this.left = param.left || undefined;
    this.right = param.right || undefined;
    this.parent = param.parent || undefined;
  }
}

class Tree {
  constructor() {
    this.leaf = new Node({ key: 0, color: CONSTANTS.BLACK });
    this.root = this.leaf;
  }

  printTree() {
    const stack = [{ node: this.root, str: "" }];

    while (stack.length) {
      const item = stack.pop();

      if (item.node == this.leaf) {
        continue;
      }

      let position = "";

      if (item.node.parent) {
        position = item.node === item.node.parent.left ? "L----" : "R----";
      } else {
        position = "ROOT-";
      }

      console.log(
        `${item.str}${position} ${item.node.key} (${item.node.color})`
      );

      stack.push({ node: item.node.right, str: item.str + "     " });
      stack.push({ node: item.node.left, str: item.str + " |   " });
    }
  }

  /**
   * @param {Node} node
   */

  rotateLeft(node) {
    const vertex = node.right;

    node.right = vertex.left;
    if (vertex.left != this.leaf) {
      vertex.left.parent = node;
    }

    vertex.parent = node.parent;
    if (!node.parent) {
      this.root = vertex;
    } else if (node === node.parent.left) {
      node.parent.left = vertex;
    } else {
      node.parent.right = vertex;
    }

    vertex.left = node;
    node.parent = vertex;
  }

  rotateRight(node) {
    const vertex = node.left;

    node.left = vertex.right;
    if (vertex.right != this.leaf) {
      vertex.right.parent = node;
    }

    vertex.parent = node.parent;
    if (!node.parent) {
      this.root = vertex;
    } else if (node == node.parent.right) {
      node.parent.right = vertex;
    } else {
      node.parent.left = vertex;
    }

    vertex.right = node;
    node.parent = vertex;
  }

  /**
   * @param {number} key
   */
  insert({ key }) {
    const node = new Node({
      key,
      left: this.leaf,
      right: this.leaf,
    });

    let parent;
    let tmp = this.root;

    while (tmp !== this.leaf) {
      parent = tmp;
      if (node.key < tmp.key) {
        tmp = tmp.left;
      } else {
        tmp = tmp.right;
      }
    }

    node.parent = parent;

    if (!parent) {
      this.root = node;
    } else if (node.key < parent.key) {
      parent.left = node;
    } else {
      parent.right = node;
    }

    if (!node.parent) {
      node.color = CONSTANTS.BLACK;
      return;
    }
    if (!node.parent.parent) {
      return;
    }

    this.balanceInsert(node);
  }

  /**
   * @param {Node} node
   */
  balanceInsert(node) {
    while (node.parent.color === CONSTANTS.RED) {
      if (node.parent === node.parent.parent.left) {
        const uncle = node.parent.parent.right;
        if (uncle.color === CONSTANTS.RED) {
          uncle.color = CONSTANTS.BLACK;
          node.parent.color = CONSTANTS.BLACK;
          node.parent.parent.color = CONSTANTS.RED;
          node = node.parent.parent;
        } else {
          if (node === node.parent.right) {
            node = node.parent;
            this.rotateLeft(node);
          }
          node.parent.color = CONSTANTS.BLACK;
          node.parent.parent.color = CONSTANTS.RED;
          this.rotateRight(node.parent.parent);
        }
      } else {
        const uncle = node.parent.parent.left;
        if (uncle.color === CONSTANTS.RED) {
          uncle.color = CONSTANTS.BLACK;
          node.parent.color = CONSTANTS.BLACK;
          node.parent.parent.color = CONSTANTS.RED;
          node = node.parent.parent;
        } else {
          if (node == node.parent.left) {
            node = node.parent;
            this.rotateRight(node);
          }
          node.parent.color = CONSTANTS.BLACK;
          node.parent.parent.color = CONSTANTS.RED;
          this.rotateLeft(node.parent.parent);
        }
      }

      if (node == this.root) {
        break;
      }
    }

    this.root.color = CONSTANTS.BLACK;
  }
}


//Test
const test = new Tree();

for (let i = 1; i < 20; i++) {
  test.insert({ key: i });
}

test.printTree();