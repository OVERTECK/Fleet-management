using System.Text.Json.Serialization;

namespace Backend.DataAccess.Entities;

public class MaintenanceRecordEntity
{
    public required Guid Id { get; init; }

    public CarEntity Car { get; init; }

    public required string CarId { get; init; }

    public required string TypeWork { get; init; }

    public required Decimal Price { get; init; }

    public required DateTime Date { get; init; }
}