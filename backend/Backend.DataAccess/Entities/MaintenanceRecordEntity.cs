using System.Text.Json.Serialization;

namespace Backend.DataAccess.Entities;

public class MaintenanceRecordEntity
{
    public required Guid Id { get; set; }

    public CarEntity Car { get; set; }

    public required string CarId { get; set; }

    public required string TypeWork { get; set; }

    public required Decimal Price { get; set; }

    public required DateTime Date { get; set; }
}