import { getI18n } from 'react-i18next'

export const locale = () => {
  return {
    en: {
      global: {
        all: 'All',
        cancel: 'Cancel',
        clear: 'Clear',
        close: 'Close',
        hide: 'Hide',
        title: 'Grant Connect',
        loginHeaderText: 'Find new funders. Target better prospects. Track your relationships.',
        loginText:
          'Connecting you with funders who share your cause so that big things can happen.',
        loginFormText: 'Log into Grant Connect',
        maintenanceMessage:
          'Grant Connect will be undergoing maintenance on January 29th from 5:00 PM to 5:30 PM (EST). You may experience some delays around this time.',
        noRemoteSeatsAvailable:
          'There are no available remote access seats at this time. Please come back in a few minutes and try again.',
        sessionTimeoutModal: {
          expiring: {
            title: 'Session is expiring',
            body: 'Your session will expire in {seconds} second(s).',
            action: 'Extend session'
          },
          expired: {
            title: 'Session has expired',
            body: 'Your session has expired due to 15 minutes of inactivity.',
            action: 'Resume session'
          }
        },
        loginErrorModal: {
          noRemoteSeats: {
            title: 'No remote access seats',
            body: 'All remote access seats are currently in use. Please try again later.',
            action: 'Retry'
          }
        },
        dates: {
          months: {
            january: 'January',
            february: 'February',
            march: 'March',
            april: 'April',
            may: 'May',
            june: 'June',
            july: 'July',
            august: 'August',
            september: 'September',
            october: 'October',
            november: 'November',
            december: 'December'
          }
        },
        detail: 'Detail',
        done: 'Done',
        email: 'Email',
        for: 'for',
        language: 'Language',
        languages: {
          bilingual: 'Bilingual',
          french: 'French',
          english: 'English',
          unknown: 'Unknown'
        },
        loading: 'Loading',
        next: 'Next',
        no: 'No',
        pages: 'Pages',
        previous: 'Previous',
        reset: 'Reset',
        save: 'Save',
        seeMore: 'See More',
        seeLess: 'See Less',
        submit: 'Submit',
        unknown: 'Unknown',
        year: 'Year',
        yes: 'Yes',
        in: 'in',
        of: 'of',
        on: 'on'
      },
      cards: {
        addNote: 'Add Note',
        deleteNote: 'Delete Note',
        deleteNoteConfirm:
          'The selected note will be permanently removed. Do you wish to continue?',
        archive: 'Archive',
        archiveConfirm:
          "Archiving this funder's pipeline stage will remove it from your pipeline. Any notes and request size data that you've saved with this funder will not be lost and can be managed from the table view of your Pipeline.",
        archiveTitle: 'Archive Funder',
        cultivation: 'Cultivation',
        delete: 'Delete',
        estimatedCapacity: 'Annual Revenue',
        funderName: 'Funder Name',
        hide: 'Hide',
        hideConfirm:
          'Hiding this funder means it will no longer display in your search results. Hidden funders can be managed from the table view of your Pipeline.',
        hideTitle: 'Hide Funder',
        identification: 'Identified',
        note: 'Note',
        notes: 'Notes',
        notesMore: 'See 1 more note',
        noShow: "Don't show me this again",
        pipelineStage: 'Pipeline Stage',
        profileNew: 'New profile',
        profileUpdated: 'Updated profile',
        qualified: 'Qualified',
        requestSize: 'Request Size',
        revenue: 'Annual Revenue',
        reset: 'Reset',
        resetConfirm:
          "Resetting this funder's pipeline stage will remove it from your pipeline. Any notes and request size data that you've saved with this funder will not be lost and can be viewed on the funder profile page.",
        resetTitle: 'Reset Pipeline Stage',
        seeAllNotes: 'See all Notes',
        takeNote: 'Take a note...',
        solicitation: 'Solicitation',
        stewardship: 'Stewardship',
        giftsLastYear: 'Gifts Last Year',
        typicalGift: 'Median Gift',
        headquarters: 'Headquarters',
        typicalRecipientSize: 'Median Recipient Size',
        upcomingDeadline: 'Upcoming Deadline',
        unknown: 'Unknown',
        website: 'Website'
      },
      search: {
        featured: 'Featured Results',
        moreResults: 'More Results',
        results: 'Results',
        mainTitle: 'Funder Search',
        allResults: 'Showing all results',
        allResultsShowing: 'Showing',
        allResultsResult: 'results',
        cause: 'All Causes',
        eligibleRegion: 'Eligible Region',
        filter: {
          capacity: 'Capacity',
          match: 'Match',
          name: 'Name',
          priority: 'Deadline',
          sortBy: 'Sort By'
        },
        filterMobile: 'Filter',
        filters: 'Filters',
        hintText: 'Keyword or funder',
        noResults:
          "Sorry, but we didn't find any results for that search! Try another keyword in the search bar above.",
        broadenSearch: 'Getting too few results? Try broadening your search.',
        closeRequests: 'Closed to Requests',
        openRequests: 'Open to Requests',
        region: 'All Regions',
        restuls: 'Results',
        toolTip: 'Search by keyword or funder name',
        view: {
          cards: 'Cards View',
          table: 'Table View'
        },
        viewsPerPage: 'Results Per Page',
        go: 'GO',
        extraMenuItem: "Not what you're looking for?",
        extraMenuItemSecond: 'Search with your term as a keyword.',
        of: 'on',
        save: 'Save',
        applyFilters: 'Apply Filters',
        close: 'Close',
        label: 'You searched for:',
        saveMySearch: 'SAVE MY SEARCH',
        viewMySearchs: 'VIEW MY SAVED SEARCHES',
        reset: 'RESET',
        savedSearch: {
          title1: 'You can only have',
          title2: 'saved searches.',
          select: 'select',
          delete: 'delete',
          blockTitle: 'My saved Search'
        },
        saveSearch: {
          error: 'You can only have 15 saved searches',
          title: 'Assign a name for this search:',
          placeholder: 'Enter name here',
          blockTitle: 'Save Search'
        }
      },
      facets: {
        showMore: 'Show {countResults} more',
        typicalGiftRange: 'Typical Gift Range',
        unlimited: 'Unlimited',
        population: 'Special Populations',
        region: 'Region',
        industry: 'Category',
        cause: 'Cause',
        administrative_area: 'Headquarters',
        international: 'International',
        new_region: 'Region',
        type_support: 'Type of Support'
      },
      autocomplete: {
        causes: 'Causes',
        populations: 'Populations',
        internationals: 'Internationals',
        regions: 'Regions',
        new_region: 'Regions',
        supports: 'Types of Supports'
      },
      funder: {
        ext: 'ext.',
        about: 'About',
        affiliations: 'Affiliations',
        all: 'All',
        amount: 'Amount',
        amountOfGifts: 'Gift Amount:',
        applicationDeadline: 'Deadline Note',
        applicationInfo: 'Application Information',
        applicationMethod: 'Application Method',
        applicationProcedure: 'Procedure',
        applicationTurnaround: 'Turnaround',
        averageRange: 'Average Grant Range',
        bilingual: 'Bilingual',
        bn: 'Business Number',
        cancel: 'Cancel',
        capitalGrants: 'Capital Grants',
        causes: 'Focus',
        charitySize: 'Charity Size',
        chartSubtitle_cause_amount:
          'Displays the distribution of dollars in the most recent two years for which data is available and recipient focus is known.',
        chartSubtitle_cause_count:
          'Displays the distribution of funds in the most recent two years for which data is available.',
        chartSubtitle_region:
          'Displays the distribution of funds in the most recent two years for which data is available and location is known, with the darkest shade indicating the province with the highest number of gifts.',
        clear: 'Clear',
        close: 'Close',
        contactInfo: 'Contact Information',
        deadlineFor: 'Next deadline',
        english: 'English',
        estabilished: 'Established',
        estimatedCapacity: 'Capacity',
        eligibleCosts: 'Eligible Costs',
        eligibleCostsDescription:
          'This funder has indicated what costs it generally will and will not consider funding for:',
        evaluationCriteria: 'Evaluation Criteria',
        evaluationCriteriaDescription:
          'The funder has indicated that requests for funding are preferred from applicants that demonstrate the following.',
        fax: 'Fax',
        filter: 'Filter',
        filters: 'Filters',
        financialData: 'Financial Data',
        financialDataUpdated: 'Financial/gift data updated',
        fiscalPeriod: 'Fiscal Period End',
        french: 'French',
        fundingInfo: 'Funding Information',
        funderPrograms: 'Funding Programs',
        geographicEligibility: 'Eligible Regions',
        giftBreakdownCause: 'Gift Breakdown by Focus',
        giftBreakdownFunding: 'Gift Breakdown by Funding Interest',
        giftBreakdownRegion: 'Gift Breakdown by Province',
        giftDetail: 'Gift Detail',
        giftHistory: 'Gift History',
        grantRange: 'Grant Range',
        deadlines: 'Deadlines',
        fundingInterests: 'Funding Interests',
        fundingRestrictions: 'Ineligible Costs',
        giftAnalysis: 'Gift Analysis',
        giftSize: 'Gift Size',
        grantingRegions: 'Eligible Regions',
        loading: 'Loading',
        location: 'Location',
        match: 'Match',
        mission: 'Mission/Philosophy',
        myRequestSize: 'My request size',
        name: 'Name',
        no: 'No',
        noresults: 'There are no results for the filters applied. Please try another filter.',
        notes: 'Notes',
        numGifts: 'Number of gifts:',
        officersDIrectors: 'Officers and Directors',
        ongoing: 'Ongoing',
        openRequests: 'Open to Requests',
        organizationNotEngaged:
          'This organization is not presently engaged in grantmaking in Canada. They are listed in Grant Connect for reference purposes only. If you believe this to be incorrect, please contact grantconnect@imaginecanada.ca.',
        passed: 'passed',
        past: 'Past',
        pastOfficersDirectors: 'Past Officers and Directors',
        phone: 'Phone',
        populations: 'Populations',
        priority: 'Priority',
        profileUpdated: 'Profile Updated',
        programs: 'Programs',
        programContact: 'Program Contact',
        publications: 'Publications and Media',
        recipient: 'Recipient',
        region: 'Region',
        reportError: 'Report an error',
        requiredApplication: 'Required for Application',
        reset: 'Effacer',
        results: 'Results',
        revenues: 'Revenues',
        seeAllNotes: 'See all notes',
        seeLess: 'See Less',
        seeMore: 'See More',
        showingAllResults: 'Showing all results',
        sortBy: 'Sort by',
        takeANote: 'Take a note',
        to: 'to',
        totalAssets: 'Assets',
        totalGifts: 'Total gifts',
        totalGiftsNumber: 'Number of gifts',
        totalGiftsProvided: 'Total Gifts Provided',
        totalRevenues: 'Total Revenues',
        toolTip:
          "These are classification terms that power Grant Connect's search. You can click on a term to explore similar funders.",
        toolTipDescription:
          'The “Grant Connect Classification System” is a derivative of the "Philanthropy Classification System" by Foundation Center, used under CC BY-NC 4.0. “Grant Connect Classification System” is licensed under CC BY by Imagine Canada.',
        typesSupport: 'Support Types',
        unknown: 'Unknown',
        website: 'Website',
        yearEstablished: 'Year Established',
        yes: 'Yes'
      },
      user: {
        login: 'Log in',
        logout: 'Logout',
        loginSystem: 'Log in to Grant Connect',
        manageAccount: 'Manage Account',
        noAccount: "Don't have an account?",
        noAccountUrl: 'https://imaginecanada.ca/en/grant-connect',
        password: 'Password',
        register: 'Register',
        remember: 'Remember',
        user: 'Username',
        email: 'Email',
        fieldRequired: 'Field required',
        resetPassword: 'Forgot username or password?',
        resetPasswordSubmit: 'Send',
        resetPasswordCaptchaError: 'Please validate the captcha',
        resetPasswordText:
          'Before continuing, it is necessary to confirm the new password to be used with this account.',
        resetPasswordTitle: 'Input your desired password.',
        userNameOrEmail:
          'Please enter the email address associated with your Grant Connect account.',
        userNameOrEmailHint: 'Username or email',
        emailNotFound:
          'We could not find a Grant Connect account associated with the email address you entered. Please try again with a different email address or contact us at grantconnect@imaginecanada.ca for assistance.',
        updatePassword: 'New password',
        updatePasswordRepeat: 'Repeat new password',
        updatePasswordError: 'New and repeated passwords are different',
        updatePasswordSubmit: 'Submit new password',
        updatePasswordRetry: 'Retry',
        updatePasswordSuccess: 'Your password has been changed.',
        profileEdit: {
          changeLogin: 'Change Login',
          editUsername: 'Edit Username',
          editPassword: 'Edit Password',
          submitUsername: 'Submit new username',
          submitPassword: 'Submit new password',
          actualUsername: 'Current username',
          actualPassword: 'Current password',
          newUsername: 'New username',
          newUsernameError: 'Usernames must be different',
          newPasswordError: 'Passwords must be different',
          usernameUpdated: 'Username updated',
          passwordUpdated: 'Password updated'
        }
      },
      pipeline: {
        addToPipeline: 'Add to Pipeline',
        fundersRequestSize: 'Funders with a total request size of',
        pipeline: 'Pipeline',
        pipelineEmpty: "There's nothing in your Pipeline. Get started by searching for funders.",
        prospectiveFunder: 'Funder',
        prospectiveFunders: 'Funders',
        exportPipeline: 'Export Pipeline',
        hide: 'Hidden Funders',
        hidden: 'Hidden',
        archive: 'Archive'
      },
      leftMenu: {
        support: 'Talk to Us',
        support_url: ' https://grantconnecthelp.zendesk.com/hc/en-us/requests/new',
        help_center: 'Help Centre',
        help_center_url: 'https://grantconnecthelp.zendesk.com/hc/en-us',
        terms: 'Terms of Use',
        terms_url:
          'https://imaginecanada.ca/sites/default/files/grant-connect-terms-of-use-2019.pdf',
        accessibility: 'Accessibility policy',
        accessibility_url: 'https://www.imaginecanada.ca/en/node/19476',
        ic: 'Imagine Canada',
        ic_url: 'http://imaginecanada.ca',
        pipeline: 'Pipeline',
        pipeline_url: '/pipeline',
        funder: 'Funder search',
        funder_url: '/search',
        gift: 'Gift Explorer',
        gift_url: '/gift',
        contact: 'Contact Explorer',
        contact_url: '/contact',
        account: 'Account',
        account_url: '/user-profile/edit',
        user_support: 'User support',
        user_support_url: 'https://grantconnecthelp.zendesk.com/hc/en-us',
        lang: 'Français',
        lang_url: '/fr'
      },
      csv: {
        funderName: 'Funder Name',
        pipelineStage: 'Pipeline Stage',
        notes: 'Notes',
        requestSize: 'Request Size',
        upcomingDeadline: 'Upcoming Deadline',
        website: 'Website',
        email: 'Email',
        phone: 'Phone'
      },
      explorer: {
        title: 'Gift Explorer',
        subtitle: 'Look up past gifts given to recipients similar to you',
        search_placeholder: 'Search gifts by funder, recipient, business number, or keyword',
        search: 'Search',
        saved_searches: 'Your Saved Searches',
        use_saved_search: "Use a Saved Search",
        no_saved_searches: "No saved searches.",
        results: 'Results',
        showing_results: 'Showing results for:',
        scroll: "Scroll to see all columns",
        graphic_1_title: 'Total amount given ($) by funder',
        graphic_2_title: 'Total amount received ($) by recipient',
        gift:
          'https://datastudio.google.com/embed/reporting/1us6Bt5AWFGJTXQpgW-7h5URLn9Fj9g1U/page/5pJDB',
        contact:
          'https://datastudio.google.com/embed/reporting/a747aeb9-1204-4578-8eb7-9d6240ade7be/page/2pL2B',
        privacy: 'Privacy',
        privacy_url: 'https://policies.google.com/privacy',
        recipient: "Recipient",
        funder: "Funder",
        amount: "Amount",
        focus: "Focus",
        location: "Location",
        year: "Year",
        description: "Description",
        add_to_pipeline: "Add to Pipeline",
        in_your_pipeline: "In your pipeline",
        your_saved_searches: 'Your Saved Searches',
        results_summary_text: 'Showing results for:',
        saved_search_summary_text: 'Search parameters:',
        keyword: "Keyword",
        recipient_min_size: "Minimum revenue ($)",
        recipient_max_size: "Maximum revenue ($)",
        amount_min: "Minimum amount",
        amount_max: "Maximum amount",
        year_min: "Year (from)",
        year_max: "Year (to)",
        focus: "Focus",
        recipient_name: "Recipient",
        funder_name: "Funder",
        location: "Region",
        purpose: "Description",
        search: "Search",
        filter_by_gift_size: "Filter by gift size",
        min_size: "Minimum ($)",
        max_size: "Maximum ($)",
        apply: "Apply",
        delete: "Delete",
        no_results: "No suggested results",
        total_amount_given: "Total $ amount given",
        total_amount_received: 'Total $ amount received',
        recipient_size: "Recipient Size",
        search_saved_on: "Search saved on",
        save_my_search: "Save my search",
        save_my_search_label: "Enter a title for your saved search",
        no_filters: "No filters applied yet.",
        save: "Save",
        filter_by_year: "Filter by year",
        years_available: "Data is available from 1980 to 2023",
        start_year: "Start year",
        end_year: "End year",
        search_by_name: "Search by name",
        recipient_name_placeholder: `Try searching for "Kitchener-Waterloo Art Gallery"`,
        funder_name_placeholder: `Try searching for "CanadaHelps"`,
        filter_by_recipient_size: "Filter by recipient size",
        min_revenue: "Minimum revenue ($)",
        max_revenue: "Maximum revenue ($)",
        full_profile: "Full Profile",
        filter_by_focus: "Filter by Focus Area",
        search_locations: "Search locations",
        search_locations_placeholder:`Try searching for "Vancouver"`,
        search_description: "Search the description",
        disclaimer: "Gift records are sourced from Canada Revenue Agency T3010 Registered Charity Information Returns, or materials published by the organization (e.g., annual report, official website, etc.). While useful for researching the capacity and interests of each organization, please be aware that these gift records may not be inclusive and may contain errors. Data in this table is updated on a quarterly basis.",
        duplicate_title_error: "A saved search with this title already exists. Please choose a unique title.",
      },
      activities: {
        numGifts: 'Number of gifts',
        grantmaking: 'Grantmaking'
      },
      categories: {
        foundations: 'Foundations'
      }
    },
    fr: {
      global: {
        all: 'Tout',
        cancel: 'Annuler',
        clear: 'Effacer',
        close: 'Fermer',
        hide: 'Cacher',
        title: 'Connexion subvention',
        loginHeaderText:
          'Trouvez de nouveaux bailleurs de fonds. Ciblez les meilleures sources potentielles. Gérez vos relations.',
        loginText:
          "Rencontrer des bailleurs de fonds passionnés par votre cause pour réussir l'exceptionnel.",
        loginFormText: 'Connectez-vous à Connexion subvention',
        maintenanceMessage:
          "Grant Connect fera l'objet d'une maintenance le 29 janvier de 17h00 à 17h30 (EST). Il se peut que vous subissiez des retards pendant cette période.",
        noRemoteSeatsAvailable:
          "Il n'y a aucun siège pour accès à distance de disponible pour le moment. Veuillez attendre quelques minutes puis essayer de nouveau.",
        sessionTimeoutModal: {
          expiring: {
            title: 'Votre session expire bientôt',
            body: 'Votre session va expirer dans {seconds} seconde(s).',
            action: 'Prolonger ma session'
          },
          expired: {
            title: 'Session expirée',
            body: "Votre session a expirée après 15 minutes d'inactivité.",
            action: 'Renouveler ma session'
          }
        },
        loginErrorModal: {
          noRemoteSeats: {
            title: 'Aucun siège disponible',
            body:
              "Tous les sièges d'accès à distance sont actuellement utilisés. Veuillez réessayer plus tard.",
            action: 'Réessayer'
          }
        },
        dates: {
          months: {
            january: 'janvier',
            february: 'février',
            march: 'mars',
            april: 'avril',
            may: 'mai',
            june: 'juin',
            july: 'juillet',
            august: 'août',
            september: 'septembre',
            october: 'octobre',
            november: 'novembre',
            december: 'décembre'
          }
        },
        detail: 'Détails',
        done: 'Terminé',
        email: 'Courriel',
        for: 'pour',
        language: 'Langue',
        languages: {
          bilingual: 'Bilingue',
          french: 'Français',
          english: 'Anglais',
          unknown: 'Inconnu'
        },
        loading: 'Téléchargement',
        next: 'Suivant',
        no: 'Non',
        pages: 'Pages',
        previous: 'Précédent',
        reset: 'Effacer',
        save: 'Enregistrer',
        seeMore: 'voir plus',
        seeLess: 'Voir moins',
        submit: 'Soumettre',
        unknown: 'Inconnu',
        year: 'Année',
        yes: 'Oui',
        in: 'dans',
        of: 'de',
        on: 'sur'
      },
      cards: {
        addNote: 'Ajouter une note',
        deleteNote: 'Effacer la note',
        deleteNoteConfirm:
          'La note que vous avez sélectionnée sera effacée de manière permanente. Désirez-vous continuer?',
        archive: 'Archiver',
        archiveConfirm:
          "Une fois l'étape de la relation avec ce bailleur de fonds archivé, ce dernier sera archivée de votre portefeuille? Les notes et données sur les montants sauvegardées ne seront pas perdues, et vous pourrez y accéder par le profil du bailleur de fonds à partir du Tableau de votre portefeuille.",
        archiveTitle: 'Archiver le bailleur de fonds',
        cultivation: 'Développement',
        delete: 'Supprimer',
        estimatedCapacity: 'Capacité de don estimée',
        funderName: 'Nom du bailleur de fonds',
        hide: 'Masquer',
        hideConfirm:
          "Une fois masqué, le bailleur de fonds n'apparaîtra plus dans vos résultats de recherche. Vous pouvez gérer les bailleurs de fonds masqués à partir du Tableau de votre portefeuille.",
        hideTitle: 'Masquer le bailleur de fonds',
        identification: 'Identifié',
        note: 'Note',
        notes: 'Notes',
        notesMore: 'Afficher 1 autre note',
        noShow: 'Ne plus montrer',
        pipelineStage: 'Étape de la relation',
        profileNew: 'Nouveau profil',
        profileUpdated: 'Profil mis à jour',
        qualified: 'Qualifié',
        requestSize: 'Montant ',
        revenue: 'Revenu annuel ',
        reset: 'Effacer',
        resetConfirm:
          "Une fois l'étape de la relation avec ce bailleur de fonds effacé, ce dernier sera éliminé de votre portefeuille. Les notes et données sur les montants sauvegardées ne seront pas perdues, et vous pourrez y accéder par le profil du bailleur de fonds.",
        resetTitle: "Effacer l'étape de la relation",
        seeAllNotes: 'Voir toutes les notes',
        solicitation: 'Soumission',
        stewardship: 'Gestion',
        takeNote: 'Créer une note...',
        totalGifts: "Dons versés l'an dernier",
        giftsLastYear: "Dons de l'année dernière",
        typicalGift: 'Don médian',
        headquarters: 'Siège social',
        typicalRecipientSize: 'Taille du bénéficiaire-type',
        upcomingDeadline: 'Prochaine date limite',
        unknown: 'Inconnu',
        website: 'Site Web'
      },
      search: {
        featured: 'En vedette',
        moreResults: 'Plus de résultats',
        results: 'Résultats',
        mainTitle: 'Recherche',
        allResults: 'Afficher tous les résultats',
        allResultsResult: 'résultats',
        allResultsShowing: 'Affiche',
        cause: 'Toutes les causes',
        eligibleRegion: 'Région',
        filter: {
          capacity: 'Capacité',
          match: 'Correspondance',
          name: 'Nom',
          priority: 'Date limite',
          sortBy: 'Trier par'
        },
        filterMobile: 'Filtre',
        filters: 'Filtres',
        hintText: 'Mot clé ou nom du bailleur de fonds',
        noResults:
          "Désolé, cette recherche n'a donné lieu à aucun résultat. Essayez d'utiliser un autre mot clé dans la barre de recherche ci-dessus.",
        broadenSearch: 'Pas assez de résultats à votre goût? Veuillez élargir votre recherche.',
        closeRequests: 'Demandes non acceptées',
        openRequests: 'Demandes acceptées',
        region: 'Toutes les régions',
        restuls: 'résultats',
        toolTip: 'Recherche par mot clé ou nom du bailleur de fonds',
        view: {
          cards: 'Liste',
          table: 'Tableau'
        },
        viewsPerPage: 'Résultats par page',
        go: 'ALLEZ',
        extraMenuItem: "Ce n'est pas ce que vous cherchez?",
        extraMenuItemSecond: 'Cherchez en utilisant votre indice comme mot clé.',
        of: 'sur',
        save: 'Sauvegarder',
        applyFilters: 'Appliquer les filtres',
        close: 'Fermer',
        label: 'Vous avez recherché:',
        saveMySearch: 'Enregistrer ma recherche',
        viewMySearchs: 'Voir les recherches enregistrées',
        reset: 'Réinitialiser',
        savedSearch: {
          title1: "Vous pouvez seulement sauvegarder jusqu'à",
          title2: 'recherches.',
          select: 'Sélectionner',
          delete: 'Supprimer',
          blockTitle: 'Mes recherches sauvegardées'
        },
        saveSearch: {
          error: "Vous pouvez seulement sauvegarder jusqu'à 15 recherches.",
          title: 'Attribuez un nom à cette recherche:',
          placeholder: 'Entrez votre nom ici',
          blockTitle: 'Mémoriser cette recherche'
        }
      },
      facets: {
        showMore: 'Afficher {countResults} de plus',
        typicalGiftRange: 'Financement-type',
        unlimited: 'Illimité',
        region: 'Région',
        industry: 'Catégorie',
        cause: 'Cause',
        administrative_area: 'Siège social',
        international: 'International',
        new_region: 'Région',
        type_support: 'Type de soutien',
        population: 'Populations particulières'
      },
      autocomplete: {
        causes: 'Causes',
        populations: 'Populations',
        industry: 'Catégorie',
        internationals: 'Internationaux',
        regions: 'Régions',
        new_region: 'Régions',
        supports: 'Types de Supports'
      },
      funder: {
        ext: 'poste',
        about: 'À propos',
        affiliations: 'Affiliations',
        all: 'Tout',
        amount: 'Montant',
        amountOfGifts: 'Montant des dons :',
        applicationDeadline: 'Date limite - note',
        applicationInfo: 'Information concernant les demandes',
        applicationMethod: 'Méthode de présentation des demandes',
        applicationProcedure: 'Procedure',
        applicationTurnaround: 'Délai de réponse',
        averageRange: 'Financement moyen',
        bilingual: 'Bilingue',
        bn: "Numéro d'entreprise",
        cancel: 'Annuler',
        capitalGrants: "Subvention d'immobilisation",
        causes: 'Les causes',
        charitySize: "Taille de l'organisation",
        chartSubtitle_cause_amount:
          'Affiche la distribution des dollars pendant les deux dernières années pour lesquelles les données sont disponibles et la cause du bénéficiaire est connue.',
        chartSubtitle_cause_count:
          'Affiche la distribution des fonds pendant les deux dernières années pour lesquelles les données sont disponibles.',
        chartSubtitle_region:
          'Affiche la distribution des dollars pendant les deux dernières années pour lesquelles les données sont disponibles et le lieu est connu, avec la teinte la plus foncée indiquant la province avec le pourcentage le plus élevé des données.',
        clean: 'Effacer',
        close: 'Fermer',
        contactInfo: 'Coordonnées',
        deadlineFor: 'Prochaine date limite ',
        funderPrograms: 'Programmes de don ',
        english: 'Anglais',
        estabilished: 'Fondé en',
        estimatedCapacity: 'Revenu annuel ',
        eligibleCosts: 'Coûts admissibles',
        eligibleCostsDescription:
          "Coûts pris en considération, ou non, aux fins de financement, selon l'information fournie par le bailleur de fonds :",
        evaluationCriteria: "Critères d'évaluation",
        evaluationCriteriaDescription:
          "Selon l'information fournie par le bailleur de fonds, la priorité sera accordée aux demandes qui démontrent les éléments suivants :",
        fax: 'Télécopieur',
        filter: 'Filtre',
        filters: 'Filtres',
        financialData: 'Données financières',
        financialDataUpdated: 'Information financière/sur les dons mise à jour',
        fiscalPeriod: "Fin de l'exercice financier",
        fundingInfo: 'Répartition par cause',
        french: 'Français',
        geographicEligibility: 'Régions admissibles',
        giftBreakdownCause: 'Répartition par cause',
        giftBreakdownFunding: 'Répartition par intérêt de financement',
        giftBreakdownRegion: 'Répartition par province',
        giftDetail: 'Détails du financement',
        giftHistory: 'Historique de dons',
        grantRange: 'Montant octroyé',
        deadlines: 'Dates limite',
        fundingInterests: 'Domaines financés',
        fundingRestrictions: 'Coûts non admissibles',
        giftAnalysis: 'Analyse des dons',
        giftSize: 'Montant du don',
        grantingRegions: 'Régions admissibles',
        loading: 'Téléchargement…',
        location: 'Lieu',
        match: 'Correspondance',
        mission: 'Mission/philosophie',
        myRequestSize: 'Mon montant demandé',
        name: 'Nom',
        no: 'Non',
        noresults:
          "Il n'y a aucuns résultats pour les filtres appliqués. Veuillez essayer un autre filtre.",
        notes: 'Notes',
        numGifts: 'Nombre des dons :',
        officersDirectors: 'Dirigeants et administrateurs',
        ongoing: 'En permanence',
        openRequests: 'Demandes acceptées',
        organizationNotEngaged:
          "L'organisation n'octroie pas de financement au Canada pour le moment, et son profil est indiqué à titre d'information seulement. Si vous pensez que cette information est erronée, veuillez nous contacter à connexionsubvention@imaginecanada.ca.",
        passed: 'passed',
        past: 'Antérieur',
        pastOfficersDirectors: 'Anciens dirigeants et administrateurs',
        phone: 'Téléphone',
        populations: 'Populations',
        priority: 'Priorité',
        profileUpdated: 'Profil mis à jour ',
        programs: 'Programmes',
        programContact: 'Personne-ressource',
        publications: 'Publications et médias',
        recipient: 'Bénéficiaire',
        region: 'Région',
        reportError: 'Signaler une erreur',
        requiredApplication: 'Informations à inclure à la demande',
        reset: 'Effacer',
        results: 'Résultats',
        revenues: 'Recettes totales',
        seeAllNotes: 'Voir toutes les notes',
        seeLess: 'Voir moins',
        seeMore: 'Voir plus',
        showingAllResults: 'Afficher tous les résultats',
        sortBy: 'Trier par',
        takeANote: 'Créer une note',
        to: 'à',
        totalAssets: 'Total des actifs',
        totalGifts: 'Total des dons',
        totalGiftsProvided: 'Total des dons octroyés',
        totalRevenues: 'Total des revenus',
        toolTip:
          "Les catégories indiquées alimentent le moteur de recherche de Connexion subvention. En cliquant sur l'une d'entre elles, vous pourrez découvrir d'autres bailleurs de fonds associés à la même catégorie.",
        toolTipDescription:
          'Le "système de classification Connexion subvention" est un dérivé du "Philanthropy Classification System" utilisé par le Foundation Center, sous la licence CC BY-NC 4.0. Le "système de classification Connexion subvention" est protégé par une licence CC BY enregistrée au nom d\'Imagine Canada.',
        typesSupport: 'Formes de soutien',
        unknown: 'Inconnu',
        website: 'Site Web',
        yearEstablished: 'Fondé en :',
        yes: 'Oui'
      },
      user: {
        login: 'Se connecter',
        logout: 'Déconnecter',
        loginSystem: 'Se connecter à Connexion subvention',
        manageAccount: 'Gérer mon compte',
        noAccount: "Vous n'avez pas de compte?",
        noAccountUrl: 'https://www.imaginecanada.ca/fr/connexion-subvention',
        password: 'Mot de passe',
        register: "S'inscrire",
        remember: 'Se rappeler de moi',
        user: "Nom d'utilisateur",
        email: 'Courriel',
        resetPassword: "Avez-vous oublié votre nom d'utilisateur ou votre mot de passe?",
        resetPasswordSubmit: 'Envoyer',
        fieldRequired: 'Champ obligatoire',
        resetPasswordCaptchaError: 'Veuillez activer le captcha',
        resetPasswordText:
          'Avant de continuer, il est nécessaire de confirmer le nouveau mot de passe à utiliser pour ce compte.',
        resetPasswordTitle: 'Veuillez fournir votre mot de passe désiré.',
        userNameOrEmail:
          "Veuillez entrer l'adresse de courriel associée à votre compte Connexion subvention.",
        userNameOrEmailHint: "Nom d'utilisateur ou courriel",
        emailNotFound:
          "Nous n'avons pas trouvé de compte associé à cette adresse de courriel. Veuillez essayer à nouveau en utilisant une autre adresse de courriel ou communiquez avec nous à connexionsubvention@imaginecanada.ca pour obtenir de l'aide.",
        updatePassword: 'Nouveau mot de passe',
        updatePasswordRepeat: 'Répéter le nouveau mot de passe',
        updatePasswordError: 'Le nouveau mot de passe et sa répétition sont différents',
        updatePasswordSubmit: 'Envoyer le nouveau mot de passe',
        updatePasswordRetry: 'Réessayer',
        updatePasswordSuccess: 'Le mot de passe a été modifié.',
        profileEdit: {
          changeLogin: 'Compte',
          editUsername: "Changer le nom d'utilisateur",
          editPassword: 'Changer le nom de passe',
          submitUsername: "Soumettre le nouveau nom d'utilisateur",
          submitPassword: 'Soumettre le nouveau mot de passe',
          actualUsername: "Nom d'utilisateur actuel",
          actualPassword: 'Mot de passe actuel',
          newUsername: "Nouveau nom d'utilisateur",
          newUsernameError: "Les nom d'utilisateur doivent être différents",
          newPasswordError: 'Les mots de passes doivent être différents',
          usernameUpdated: "Nom d'utilisateur mis à jour",
          passwordUpdated: 'Mot de passe mis à jour'
        }
      },
      pipeline: {
        addToPipeline: 'Ajouter au portefeuille',
        fundersRequestSize: 'bailleurs de fonds avec une capacité de financement de',
        pipeline: 'Portefeuille',
        pipelineEmpty: 'Votre portefeuille est vide. Commencez votre recherche.',
        prospectiveFunder: 'bailleur de fonds',
        prospectiveFunders: 'bailleurs de fonds',
        exportPipeline: 'Exporter le portefeuille',
        hide: 'Bailleurs de fonds masqués',
        hidden: 'Masqué',
        archive: 'Archiver'
      },
      leftMenu: {
        support: 'Contactez-nous',
        support_url: 'https://grantconnecthelp.zendesk.com/hc/fr-ca/requests/new',
        help_center: "Centre d'aide",
        help_center_url: 'https://grantconnecthelp.zendesk.com/hc/fr-ca',
        terms: "Conditions d'utilisation",
        terms_url:
          'https://www.imaginecanada.ca/sites/default/files/Conditions-d-utilisation-de-Connexion-subvention-2019.pdf',
        accessibility: "Politique d'accessibilité",
        accessibility_url: 'https://www.imaginecanada.ca/fr/node/19476',
        ic: 'Imagine Canada',
        ic_url: 'http://imaginecanada.ca/fr',
        pipeline: 'Portefeuille',
        pipeline_url: '/pipeline',
        funder: 'Recherche',
        funder_url: '/search',
        gift: 'Explorateur de dons',
        gift_url: '/gift',
        contact: 'Explorateur de contacts',
        contact_url: '/contact',
        account: 'Compte',
        account_url: '/user-profile/edit',
        user_support: 'Soutien aux utilisateurs',
        user_support_url: 'https://grantconnecthelp.zendesk.com/hc/en-us',
        lang: 'English',
        lang_url: '/'
      },
      csv: {
        funderName: 'Nom du bailleur de fonds',
        pipelineStage: 'Étape de la relation',
        notes: 'Notes',
        requestSize: 'Montant',
        upcomingDeadline: 'Prochaine date limite',
        website: 'Site Web',
        email: 'Courriel',
        phone: 'Téléphone'
      },
      explorer: {
        gift:
          'https://datastudio.google.com/embed/reporting/c7654de1-680d-404e-bf4e-e47f56058e2a/page/5pJDB?hl=fr',
        contact:
          'https://datastudio.google.com/embed/reporting/32ae3fff-ad49-4653-82ef-323329522aac/page/2pL2B?hl=fr',
        privacy: 'Confidentialité',
        privacy_url: 'https://policies.google.com/privacy',
        results_summary_text: "Showing results for:",
        keyword: "Keyword",
        amount: "Amount",
        cause: "Focus",
      },
      activities: {
        numGifts: 'Nombre de dons',
        grantmaking: 'Octroi de subventions'
      },
      categories: {
        foundations: 'Fondations'
      }
    }
  }
}

export const getLanguage = () => {
  const i18n = getI18n()
  const t = i18n.getResourceBundle(i18n.language)

  return { language: i18n.language, t }
}
