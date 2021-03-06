﻿using Inventorization.Business.Model;
using System;

namespace Inventorization.Api.ViewModels
{
    public class ZoneViewModel
    {
        public Guid ZoneId { get; set; }
        public int? Number { get; set; }
        public string ZoneName { get; set; }
        public DateTime? OpenedAt { get; set; }
        public DateTime? ClosedAt { get; set; }
        public Guid? OpenedBy { get; set; }
        public Guid? ClosedBy { get; set; }
        public ZoneStatus Status { get; set; }
        public int TotalItems { get; set; }
    }

}