using System.Text.Json.Serialization;

namespace Backend.DataAccess.Entities;

public class GasStationEntity
{
    public required Guid Id { get; init; }

    public required string CarId { get; init; }

    public required int RefilledLiters { get; init; }

    public required Decimal Price { get; init; }

    [JsonIgnore]
    public CarEntity Car { get; init; }
}