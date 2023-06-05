export const footerArgTypes = {
  footerTitle: {
    name: 'title',
    type: { name: 'string', required: false },
    description: "String wich defines footer's title",
    control: { type: 'text' },
    table: {
      category: 'Footer'
    }
  },
  footerTelephone: {
    name: 'telephone',
    type: { name: 'string', required: false },
    description: "String wich defines footer's telephone",
    control: { type: 'text' },
    table: {
      category: 'Footer'
    }
  },
  footerTelephoneComplement: {
    name: 'telephone complement',
    type: { name: 'string', required: false },
    description: "String wich defines footer's telephone complement",
    control: { type: 'text' },
    table: {
      category: 'Footer'
    }
  },
  footerEmail: {
    name: 'email',
    type: { name: 'string', required: false },
    description: "String wich defines footer's email",
    control: { type: 'text' },
    table: {
      category: 'Footer'
    }
  },
  footerLink: {
    name: 'link',
    type: { name: 'string', required: false },
    description: "String wich defines footer's link",
    control: { type: 'text' },
    table: {
      category: 'Footer'
    }
  },
  footerTextLink: {
    name: 'text link',
    type: { name: 'string', required: false },
    description: "String wich defines footer's text link",
    control: { type: 'text' },
    table: {
      category: 'Footer'
    }
  },
  footerDescription: {
    name: 'description',
    type: { name: 'string', required: false },
    description: "String wich defines footer's description",
    control: { type: 'text' },
    table: {
      category: 'Footer'
    }
  },
  footerCopyrightText: {
    name: 'copyright text',
    type: { name: 'string', required: false },
    description: "String wich defines footer's copyright text",
    control: { type: 'text' },
    table: {
      category: 'Footer'
    }
  },
  footerSignatureText: {
    name: 'signature text',
    type: { name: 'string', required: false },
    description: "String wich defines footer's signature text",
    control: { type: 'text' },
    table: {
      category: 'Footer'
    }
  },
  footerSignatureLink: {
    name: 'signature link',
    type: { name: 'string', required: false },
    description: "String wich defines footer's signature link",
    control: { type: 'text' },
    table: {
      category: 'Footer'
    }
  }
};

export const navbarArgTypes = {
  isLandingPage: {
    name: 'isLandingPage',
    type: { name: 'boolean', required: false },
    description: 'Boolean which defines if the navbar is for a landing page.',
    options: [true, false],
    control: { type: 'boolean' },
    table: {
      category: 'Navbar'
    }
  },
  haveSearchBar: {
    name: 'haveSearchBar',
    type: { name: 'boolean', required: false },
    description: 'Boolean which defines if the navbar has a search bar.',
    options: [true, false],
    control: { type: 'boolean' },
    table: {
      category: 'Navbar'
    }
  },
  hiddenUser: {
    name: 'hiddenUser',
    type: { name: 'boolean', required: false },
    description: 'Boolean which defines if the navbar hides the user.',
    options: [true, false],
    control: { type: 'boolean' },
    table: {
      category: 'Navbar'
    }
  },
  user: {
    name: 'user',
    control: 'object',
    description:
      'Object wich defines all the informations about the current user',
    table: {
      category: 'Navbar'
    },
    if: {
      arg: 'hiddenUser',
      eq: false,
      table: {
        disable: true
      }
    }
  },
  h1: {
    name: 'h1',
    type: { name: 'boolean', required: false },
    description: "Boolean wich defines the height of navbar's title",
    options: [true, false],
    control: { type: 'boolean' },
    table: {
      category: 'Navbar'
    }
  },
  title: {
    name: 'title',
    type: { name: 'string', required: true },
    description: "String wich defines navbar's title",
    control: { type: 'text' },
    table: {
      category: 'Navbar'
    }
  },
  sideMenuLinks: {
    name: 'sideMenuLinks',
    control: 'object',
    description: 'Array of Object which defines the custom side menu',
    table: {
      category: 'Navbar'
    }
  },
  systemsList: {
    name: 'systemsList',
    control: 'object',
    description: 'Array which defines the systems contained in popup',
    table: {
      category: 'Navbar'
    }
  },
  systemsListPopup: {
    name: 'systemsListPopup',
    type: { name: 'boolean', required: false },
    options: [true, false],
    control: { type: 'boolean' },
    description: 'Boolean which defines if the navbar has a menu popup',
    table: {
      category: 'Navbar'
    }
  },
  iconComponent: {
    name: 'iconComponent',
    description: 'Icon of system that appears in navbar',
    table: {
      category: 'Navbar'
    }
  }
};
