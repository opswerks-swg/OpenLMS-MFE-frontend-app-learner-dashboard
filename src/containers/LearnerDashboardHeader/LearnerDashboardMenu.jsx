import React from 'react';
import {
  IconHome,
  IconBook,
  IconClockHour3,
  IconSearch,
  IconHelpHexagon,
  IconBell,
} from '@tabler/icons-react';
import { getConfig } from '@edx/frontend-platform';

import urls from 'data/services/lms/urls';

import messages from './messages';

const ICON_MAP = {
  Home: IconHome,
  LibraryBooks: IconBook,
  ClockHour3: IconClockHour3,
  Search: IconSearch,
  HelpHexagon: IconHelpHexagon,
};

const NavItem = ({ icon: IconComponent, label }) => (
  <span className="d-inline-flex align-items-center lw-nav-item">
    <IconComponent size={18} className="lw-nav-icon" />
    <span>{label}</span>
  </span>
);

const getLearnerHeaderMenu = (
  formatMessage,
  courseSearchUrl,
  authenticatedUser,
  exploreCoursesClick,
) => {
  const BASE_URL = getConfig().LMS_BASE_URL;
  const configNavLinks = getConfig().HEADER_NAV_LINKS;
  const isLinkActive = (link) => {
    if (link.url === '/dashboard' || link.url.endsWith('/dashboard')) {
      return getConfig().APP_ID === 'learner-dashboard';
    }
    const linkPath = link.url.startsWith('http')
      ? new URL(link.url).pathname
      : link.url;
    return window.location.pathname === linkPath;
  };

  const mainMenu = configNavLinks
    ? configNavLinks.map((link) => ({
      type: 'item',
      href: link.url.startsWith('http') ? link.url : `${BASE_URL}${link.url}`,
      isActive: isLinkActive(link),
      content: (
        <NavItem
          icon={ICON_MAP[link.icon] ?? IconHome}
          label={link.title}
        />
      ),
    }))
    : [
      {
        type: 'item',
        href: '/',
        content: formatMessage(messages.course),
        isActive: true,
      },
      ...(getConfig().ENABLE_PROGRAMS ? [{
        type: 'item',
        href: `${urls.programsUrl()}`,
        content: formatMessage(messages.program),
      }] : []),
      ...(!getConfig().NON_BROWSABLE_COURSES ? [{
        type: 'item',
        href: `${urls.baseAppUrl(courseSearchUrl)}`,
        content: formatMessage(messages.discoverNew),
        onClick: (e) => {
          exploreCoursesClick(e);
        },
      }]
        : []),
    ];

  const searchItem = courseSearchUrl ? [{
    type: 'item',
    href: null,
    className: 'lw-search-item',
    content: (
      <div className="lw-search-wrapper">
        <IconSearch size={16} className="lw-search-icon" />
        <input
          className="lw-search-input"
          type="search"
          aria-label={formatMessage(messages.searchPlaceholder)}
          placeholder={formatMessage(messages.searchPlaceholder)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const q = e.target.value.trim();
              window.location.href = urls.baseAppUrl(courseSearchUrl)
                + (q ? `?q=${encodeURIComponent(q)}` : '');
            }
          }}
        />
      </div>
    ),
  }] : [];

  return {
    mainMenu: [...mainMenu, ...searchItem],
    secondaryMenu: (
      <button className="lw-notification-btn" aria-label="Notifications">
        <IconBell size={24} />
      </button>
    ),
    userMenu: [
      {
        heading: '',
        items: [
          {
            type: 'item',
            href: `${getConfig().ACCOUNT_PROFILE_URL}/u/${authenticatedUser?.username}`,
            content: formatMessage(messages.profile),
          },
          {
            type: 'item',
            href: `${getConfig().ACCOUNT_SETTINGS_URL}`,
            content: formatMessage(messages.account),
          },
          ...(getConfig().ORDER_HISTORY_URL ? [{
            type: 'item',
            href: getConfig().ORDER_HISTORY_URL,
            content: formatMessage(messages.orderHistory),
          }] : []),
        ],
      },
      {
        heading: '',
        items: [
          {
            type: 'item',
            href: `${getConfig().LOGOUT_URL}`,
            content: formatMessage(messages.signOut),
          },
        ],
      },
    ],
  };
};

export default getLearnerHeaderMenu;
