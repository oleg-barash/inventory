using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inventorization.Business.Interfaces;
using Inventorization.Business.Model;

namespace Inventorization.Api.ViewModels.Builders
{
    public interface IUsageBuilder
    {
        IEnumerable<ZoneUsageViewModel> GetUsageViewModels(List<ZoneUsage> states);
        ZoneUsageViewModel GetUsageViewModel(ZoneUsage state);
    }

    public class UsageBuilder : IUsageBuilder
    {
        private readonly IUserRepository _userRepository;

        public UsageBuilder(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public IEnumerable<ZoneUsageViewModel> GetUsageViewModels(List<ZoneUsage> states)
        {
            return states.Select(GetUsageViewModel);
        }

        public ZoneUsageViewModel GetUsageViewModel(ZoneUsage state)
        {
            User user = _userRepository.GetUsers().Single(u => state.AssignedAt == u.Id);
            return new ZoneUsageViewModel
            {
                Type = state.Type,
                OpenedAt = state.OpenedAt,
                OpenedBy = state.OpenedBy,
                ClosedAt = state.ClosedAt,
                ClosedBy = state.ClosedBy,
                ZoneId = state.ZoneId,
                InventorizationId = state.InventorizationId,
                AssignedAt = state.AssignedAt != null ? user.GetFullName() : "не назначена"
            };
        }

    }
}